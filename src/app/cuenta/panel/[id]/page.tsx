import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Venue } from "@/data/venues";
import LugarForm from "../LugarForm";
import ActividadesEditor from "../ActividadesEditor";
import FotoUploader from "../FotoUploader";
import PlanBilling from "../PlanBilling";
import {
  actualizarLugar,
  actualizarActividades,
  actualizarFotoPrincipal,
  eliminarLugar,
} from "../actions";

export const dynamic = "force-dynamic";

const SELECT_VENUE_PROPIO = `
  id, slug, nombre, tipo, ciudad, direccion, lat, lng, descripcion, tags,
  precio, calificacion, destacado, plan,
  ownerId:owner_id, estadoPago:estado_pago,
  telefono, instagram, sitioWeb:sitio_web, urlReserva:url_reserva,
  imagenColor:imagen_color, fotoPrincipalUrl:foto_principal_url,
  actividadesSemana:venue_actividades(dias, nombre, hora, descripcion)
`;

export default async function EditarLugarPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string; ok?: string; pago?: string }>;
}) {
  const { id } = await params;
  const { error, ok, pago } = await searchParams;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/cuenta/login");

  const { data: venue } = await supabase
    .from("venues")
    .select(SELECT_VENUE_PROPIO)
    .eq("id", id)
    .maybeSingle();

  if (!venue || (venue as unknown as Venue).ownerId !== user.id) notFound();

  const v = venue as unknown as Venue;
  const guardarActividades = actualizarActividades.bind(null, v.id);
  const guardarFoto = actualizarFotoPrincipal.bind(null, v.id);
  const guardarLugar = actualizarLugar.bind(null, v.id);
  const borrarLugar = eliminarLugar.bind(null, v.id);

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <Link href="/cuenta/panel" className="text-sm text-white/60 hover:text-white">
        ← Mi panel
      </Link>

      <h1 className="mt-4 text-2xl font-bold">{v.nombre}</h1>

      {ok && (
        <p className="mt-4 rounded-lg bg-fuchsia-500/10 px-3 py-2 text-sm text-fuchsia-300">
          Guardado ✓
        </p>
      )}
      {pago === "exito" && (
        <p className="mt-4 rounded-lg bg-fuchsia-500/10 px-3 py-2 text-sm text-fuchsia-300">
          Pago en proceso. Tu plan se activa apenas Recurrente lo confirme.
        </p>
      )}
      {pago === "cancelado" && (
        <p className="mt-4 rounded-lg bg-white/5 px-3 py-2 text-sm text-white/60">
          Pago cancelado.
        </p>
      )}
      {error && (
        <p className="mt-4 rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-300">
          {error}
        </p>
      )}

      <section className="mt-8">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-white/50">
          Plan y cobro
        </h2>
        <div className="mt-3">
          <PlanBilling venueId={v.id} plan={v.plan} estadoPago={v.estadoPago} />
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-white/50">
          Foto principal
        </h2>
        <div className="mt-3">
          <FotoUploader
            venueId={v.id}
            fotoActual={v.fotoPrincipalUrl ?? undefined}
            onSubida={guardarFoto}
          />
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-white/50">
          Horario de actividades
        </h2>
        <p className="mt-1 text-sm text-white/50">
          Se muestra sola la actividad que corresponde al día real — no
          tienes que actualizar nada cada día.
        </p>
        <div className="mt-3">
          <ActividadesEditor
            actividadesIniciales={v.actividadesSemana ?? []}
            onGuardar={guardarActividades}
          />
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-white/50">
          Datos del lugar
        </h2>
        <LugarForm action={guardarLugar} valoresIniciales={v} />
      </section>

      <section className="mt-10 border-t border-white/10 pt-6">
        <form action={borrarLugar}>
          <button className="text-sm text-red-400 hover:underline">
            Eliminar este lugar permanentemente
          </button>
        </form>
      </section>
    </div>
  );
}
