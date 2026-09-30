-- GuateLife: esquema de base de datos para Supabase.
-- Cómo usarlo: entra a tu proyecto en supabase.com > SQL Editor > New query,
-- pega todo este archivo y dale "Run". Se puede correr una sola vez.

-- ============================================================
-- Tabla: venues (lugares publicados por los dueños de negocio)
-- ============================================================
create table if not exists public.venues (
  id uuid primary key default gen_random_uuid(),
  -- NULL = lugar curado por el administrador de la app (ej. los de ejemplo);
  -- con un valor = lugar creado por su propio dueño desde el panel.
  owner_id uuid references auth.users(id) on delete cascade,
  slug text unique not null,
  nombre text not null,
  tipo text not null check (tipo in ('bar', 'discoteca', 'restaurante', 'spot')),
  ciudad text not null,
  direccion text not null,
  lat double precision not null,
  lng double precision not null,
  descripcion text not null default '',
  tags text[] not null default '{}',
  precio smallint not null default 2 check (precio between 1 and 3),
  calificacion numeric not null default 0,
  -- "destacado" se activa automáticamente cuando el pago del plan está activo
  destacado boolean not null default false,
  plan text not null default 'basico' check (plan in ('basico', 'destacado', 'premium')),
  estado_pago text not null default 'sin_pago' check (estado_pago in ('sin_pago', 'activo', 'vencido', 'cancelado')),
  telefono text,
  instagram text,
  sitio_web text,
  url_reserva text,
  imagen_color text not null default '#db2777',
  foto_principal_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists venues_owner_id_idx on public.venues(owner_id);

-- ============================================================
-- Tabla: venue_actividades (horario semanal recurrente)
-- ============================================================
create table if not exists public.venue_actividades (
  id uuid primary key default gen_random_uuid(),
  venue_id uuid not null references public.venues(id) on delete cascade,
  -- dias: 0=domingo, 1=lunes ... 6=sábado
  dias smallint[] not null,
  nombre text not null,
  hora text not null,
  descripcion text not null default ''
);

create index if not exists venue_actividades_venue_id_idx on public.venue_actividades(venue_id);

-- ============================================================
-- Tabla: venue_fotos (fotos subidas por el dueño del negocio)
-- ============================================================
create table if not exists public.venue_fotos (
  id uuid primary key default gen_random_uuid(),
  venue_id uuid not null references public.venues(id) on delete cascade,
  storage_path text not null,
  created_at timestamptz not null default now()
);

create index if not exists venue_fotos_venue_id_idx on public.venue_fotos(venue_id);

-- ============================================================
-- Tabla: suscripciones (estado de cobro con Recurrente)
-- ============================================================
create table if not exists public.suscripciones (
  id uuid primary key default gen_random_uuid(),
  venue_id uuid not null unique references public.venues(id) on delete cascade,
  proveedor text not null default 'recurrente',
  proveedor_customer_id text,
  proveedor_subscription_id text,
  plan text not null check (plan in ('destacado', 'premium')),
  estado text not null default 'pendiente' check (estado in ('pendiente', 'activo', 'vencido', 'cancelado')),
  updated_at timestamptz not null default now()
);

-- Mantiene updated_at al día en venues y suscripciones
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists venues_set_updated_at on public.venues;
create trigger venues_set_updated_at
  before update on public.venues
  for each row execute function public.set_updated_at();

drop trigger if exists suscripciones_set_updated_at on public.suscripciones;
create trigger suscripciones_set_updated_at
  before update on public.suscripciones
  for each row execute function public.set_updated_at();

-- ============================================================
-- Seguridad: Row Level Security (RLS)
-- ============================================================
alter table public.venues enable row level security;
alter table public.venue_actividades enable row level security;
alter table public.venue_fotos enable row level security;
alter table public.suscripciones enable row level security;

-- venues: el directorio es público para leer, pero solo el dueño edita lo suyo
drop policy if exists "venues_select_publico" on public.venues;
create policy "venues_select_publico" on public.venues
  for select using (true);

drop policy if exists "venues_insert_propio" on public.venues;
create policy "venues_insert_propio" on public.venues
  for insert with check (auth.uid() = owner_id);

drop policy if exists "venues_update_propio" on public.venues;
create policy "venues_update_propio" on public.venues
  for update using (auth.uid() = owner_id);

drop policy if exists "venues_delete_propio" on public.venues;
create policy "venues_delete_propio" on public.venues
  for delete using (auth.uid() = owner_id);

-- venue_actividades: lectura pública, escritura solo del dueño del lugar
drop policy if exists "actividades_select_publico" on public.venue_actividades;
create policy "actividades_select_publico" on public.venue_actividades
  for select using (true);

drop policy if exists "actividades_escritura_propia" on public.venue_actividades;
create policy "actividades_escritura_propia" on public.venue_actividades
  for all using (
    exists (select 1 from public.venues v where v.id = venue_id and v.owner_id = auth.uid())
  ) with check (
    exists (select 1 from public.venues v where v.id = venue_id and v.owner_id = auth.uid())
  );

-- venue_fotos: lectura pública, escritura solo del dueño del lugar
drop policy if exists "fotos_select_publico" on public.venue_fotos;
create policy "fotos_select_publico" on public.venue_fotos
  for select using (true);

drop policy if exists "fotos_escritura_propia" on public.venue_fotos;
create policy "fotos_escritura_propia" on public.venue_fotos
  for all using (
    exists (select 1 from public.venues v where v.id = venue_id and v.owner_id = auth.uid())
  ) with check (
    exists (select 1 from public.venues v where v.id = venue_id and v.owner_id = auth.uid())
  );

-- suscripciones: solo el dueño del lugar puede ver su propio estado de pago.
-- Nadie puede insertar/editar desde el navegador: eso solo lo hace el
-- webhook de Recurrente, usando la llave "service_role" (que se salta RLS).
drop policy if exists "suscripciones_select_propia" on public.suscripciones;
create policy "suscripciones_select_propia" on public.suscripciones
  for select using (
    exists (select 1 from public.venues v where v.id = venue_id and v.owner_id = auth.uid())
  );

-- ============================================================
-- Storage: bucket para fotos de los lugares
-- ============================================================
insert into storage.buckets (id, name, public)
values ('fotos', 'fotos', true)
on conflict (id) do nothing;

-- Cualquiera puede ver las fotos (el directorio es público)
drop policy if exists "fotos_storage_select_publico" on storage.objects;
create policy "fotos_storage_select_publico" on storage.objects
  for select using (bucket_id = 'fotos');

-- Un usuario autenticado solo puede subir/borrar dentro de su propia
-- carpeta: fotos/{auth.uid()}/...
drop policy if exists "fotos_storage_escritura_propia" on storage.objects;
create policy "fotos_storage_escritura_propia" on storage.objects
  for all using (
    bucket_id = 'fotos' and (storage.foldername(name))[1] = auth.uid()::text
  ) with check (
    bucket_id = 'fotos' and (storage.foldername(name))[1] = auth.uid()::text
  );
