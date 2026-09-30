# GuateLife 📍

App web/móvil para descubrir qué hacer en Guatemala: bares, discotecas,
restaurantes y spots (miradores, parques, lugares turísticos), con las
actividades del día, cuáles son los más recomendados, qué tan cerca están
del usuario, y un newsletter con las novedades. Construida con Next.js +
TypeScript + Tailwind CSS + Supabase (cuentas, base de datos, fotos), con
cobros automáticos vía Recurrente, y empaquetada como app nativa con
Capacitor.

**Los propios negocios se registran, editan su ficha (fotos, horario de
actividades) y pagan su plan con tarjeta — tú no tienes que hacer nada de
eso manualmente.** Ver la sección [Cuentas de usuario, fotos y
cobros](#cuentas-de-usuario-fotos-y-cobros-supabase--recurrente) para
configurarlo.

## Modelo de ingresos (automatizado)

La app funciona como **directorio patrocinado, auto-servicio**: es gratis
para los usuarios que buscan a dónde ir. Los negocios se registran ellos
mismos en `/cuenta/registro`, publican su lugar en el plan Básico
(gratis), y si quieren más visibilidad pagan con tarjeta directo en la app
— el pago se confirma solo (webhook) y el plan se activa sin que tú
intervengas.

| Plan | Precio | Qué obtiene el negocio |
| --- | --- | --- |
| Básico | Gratis | Aparece listado en el directorio |
| Destacado | Q250/mes | Insignia "Destacado", prioridad en resultados |
| Premium | Q600/mes | Todo lo anterior + botón de reservas/enlace de afiliado + banner en portada |

**Fuentes de ingreso adicionales que puedes activar sin mucho esfuerzo:**

- **Enlaces de afiliado/reservas** (`urlReserva`, lo llena el propio
  negocio en su panel): cobra comisión por cada reserva referida.
- **Anuncios (Google AdSense)**: una vez la app tenga tráfico, puedes
  añadir un banner de anuncios en `src/app/layout.tsx` sin tocar el resto
  del código.
- **Publicidad de eventos especiales**: cobra por destacar un evento
  puntual en la portada o el newsletter por unos días.

## Cómo agregar o editar lugares

**Los negocios reales se agregan solos**, desde `/cuenta/registro` →
"Agregar un lugar nuevo" en su panel. Ahí editan nombre, dirección,
descripción, foto principal y horario de actividades.

Como administrador, tú solo necesitas: crear lugares "curados" (de
ejemplo o promocionales) directo en la base de datos — ver
`supabase/seed.sql` para el formato, o edítalos desde el **Table Editor**
de tu proyecto en supabase.com.

**"Actividad de hoy" automática:** cada lugar puede tener un horario
semanal (`venue_actividades`: días de la semana + nombre + hora +
descripción). La app calcula sola cuál mostrar según el día real, sin que
nadie edite nada manualmente cada día.

## Cómo publicar novedades

Edita `src/data/novedades.ts` y agrega un objeto nuevo (fecha, título,
resumen). Se muestran automáticamente en `/novedades`, de la más reciente
a la más antigua.

## Newsletter

En `/novedades` hay un formulario de suscripción (`NewsletterSignup`).
Por ahora funciona de forma simple y sin backend: abre el correo del
usuario con un mensaje pre-armado dirigido a `contacto@guatelife.app` para
que tú agregues manualmente a esa persona a tu lista.

**Para automatizarlo** cuando tengas más suscriptores, lo más rápido es
reemplazar ese flujo por un formulario embebido de un servicio gratuito:

1. Crea una cuenta gratis en [Buttondown](https://buttondown.com) o
   [Mailchimp](https://mailchimp.com).
2. Copia el HTML de su formulario de suscripción.
3. Reemplaza el `<form>` de `src/components/NewsletterSignup.tsx` por ese
   formulario (mismo estilo, solo cambia el `action` y los campos).

Así los correos llegan directo a tu lista y puedes mandar el newsletter
real desde esa plataforma.

## Funcionalidades

- **Explorar** (`/`): buscador, filtro por tipo (bar, discoteca,
  restaurante, spot), por ciudad, por "solo con actividad hoy", y orden
  por recomendados, mejor calificados o más cercanos (usando la ubicación
  del navegador).
- **Detalle de lugar** (`/lugar/[slug]`): descripción, actividad del día,
  dirección con enlace a Google Maps, contacto y botón de reserva.
- **Novedades** (`/novedades`): qué está pasando y qué hay de nuevo, más
  el formulario de newsletter.
- **Anúnciate aquí** (`/anunciate`): planes de monetización, con enlace
  directo a crear una cuenta de negocio.
- **Cuenta de negocio** (`/cuenta/registro`, `/cuenta/login`,
  `/cuenta/panel`): el dueño se registra, publica su lugar, sube su foto,
  edita su horario de actividades y paga su plan con tarjeta —
  todo self-service.

## Cuentas de usuario, fotos y cobros (Supabase + Recurrente)

### 1. Supabase (cuentas, base de datos, fotos)

1. Entra a tu proyecto en [supabase.com](https://supabase.com) (o crea uno
   nuevo, tiene plan gratis).
2. **SQL Editor → New query**: pega y corre `supabase/schema.sql` (crea
   las tablas, permisos y el bucket de fotos). Opcional: corre después
   `supabase/seed.sql` para tener lugares de ejemplo.
3. **Authentication → Providers**: confirma que "Email" esté activado
   (viene así por defecto). Si no quieres que pida confirmar el correo al
   registrarse, desactiva "Confirm email" ahí mismo.
4. **Project Settings → API**: copia la "Project URL" y la llave
   "anon public" — van en `.env.local` (copia `.env.local.example`) y
   también en las variables de entorno de Vercel:
   ```
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   ```
5. La llave **"service_role"** (en esa misma pantalla) va SOLO en
   `SUPABASE_SERVICE_ROLE_KEY`, y solo en Vercel (nunca la pegues en un
   chat ni la subas a git): la usa el webhook de pagos para activar el
   plan de un negocio saltándose los permisos normales.

### 2. Recurrente (cobros con tarjeta)

⚠️ Esta parte del código se escribió **sin poder acceder a la
documentación real de Recurrente** (bloqueada desde el entorno donde se
generó). Antes de cobrar dinero real:

1. Crea tu cuenta en [recurrente.com](https://recurrente.com).
2. En su dashboard, sección **Developers/API**, copia tus llaves y
   ponlas en las variables de entorno:
   ```
   RECURRENTE_PUBLIC_KEY=...
   RECURRENTE_SECRET_KEY=...
   RECURRENTE_WEBHOOK_SECRET=...
   ```
3. Configura un webhook en Recurrente apuntando a
   `https://TU-DOMINIO.vercel.app/api/pagos/webhook`.
4. Abre `src/lib/pagos/recurrente.ts` y `src/app/api/pagos/webhook/route.ts`:
   están marcados con comentarios `AJUSTA ESTO` en cada punto donde el
   nombre exacto de un campo o header debe confirmarse contra su
   documentación real o probando un pago de prueba. Es la única parte del
   proyecto que necesita esa verificación manual.

### 3. Variables de entorno en Vercel

En tu proyecto de Vercel: **Settings → Environment Variables**, agrega las
mismas 6 variables de `.env.local.example` con sus valores reales, y
vuelve a desplegar.

## Desarrollo local

```bash
npm install
cp .env.local.example .env.local   # y llena los valores
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

## Producción

```bash
npm run build
npm run start
```

## Desplegar gratis (recomendado: Vercel)

1. Sube este repositorio a GitHub (ya está listo).
2. Entra a [vercel.com/new](https://vercel.com/new), importa el repo.
3. Antes de darle deploy (o justo después), agrega las variables de
   entorno de la sección anterior en **Settings → Environment Variables**.
4. Cada push a la rama conectada actualiza el sitio solo.

A diferencia de la primera versión, esto ya no es 100% gratis para
siempre: Supabase y Recurrente tienen planes gratis para empezar, pero
cobran según uso/transacciones a medida que creces.

## App nativa (Android/iOS) con Capacitor

El proyecto ya está preparado para empaquetarse como app nativa con
[Capacitor](https://capacitorjs.com). Como ahora hay login, fotos y pagos
(necesitan servidor), **la app ya no empaqueta archivos estáticos: carga
tu URL de Vercel en vivo**, dentro de un contenedor nativo con acceso a
funciones del dispositivo.

- `capacitor.config.ts` define el id de la app (`com.guatelife.app`) y
  `server.url`, que **debes reemplazar** por tu dominio real de Vercel
  antes de compilar (`https://TU-DOMINIO-DE-VERCEL.vercel.app`).
- Las carpetas `android/` y `ios/` son los proyectos nativos generados
  (ya están en el repo, listos para abrir en Android Studio / Xcode).

### Flujo de trabajo

Después de cambiar `capacitor.config.ts` (por ejemplo, al poner tu
dominio real), sincroniza los proyectos nativos con:

```bash
npm run cap:sync   # npx cap sync
```

### Android (Google Play)

Requiere [Android Studio](https://developer.android.com/studio) instalado.

```bash
npm run android:open   # abre android/ en Android Studio
```

Desde Android Studio: `Build > Generate Signed App Bundle` para crear el
`.aab` que se sube a la [Google Play Console](https://play.google.com/console)
($25 USD pago único por la cuenta de desarrollador).

### iOS (Apple App Store)

Requiere una **Mac** con Xcode instalado (no es posible compilar ni firmar
apps de iOS desde Linux/Windows).

```bash
npm run ios:open   # abre ios/App en Xcode
```

Desde Xcode: `Product > Archive` para generar el build y subirlo a
[App Store Connect](https://appstoreconnect.apple.com) (requiere cuenta de
Apple Developer Program, $99 USD/año).

### Ícono y splash screen

Ya están generados a partir de `assets/icon.png` (el pin 📍 de la marca) y
aplicados a Android, iOS y PWA con `@capacitor/assets`. Si más adelante
quieres un logo distinto, reemplaza `assets/icon.png` (1024×1024) y
`assets/splash.png` (2732×2732) y corre:

```bash
npx capacitor-assets generate
npm run cap:sync
```

### Política de privacidad

Ya existe en `/privacidad` (obligatoria en ambas tiendas). Antes de
publicar, actualiza el correo de contacto ahí y en `/anunciate` y el
newsletter por uno real tuyo.

### Antes de publicar en las tiendas

- Reemplazar `server.url` en `capacitor.config.ts` por tu dominio real de
  Vercel (no el de ejemplo) y correr `npm run cap:sync`.
- Verificar la integración de Recurrente contra su documentación real
  (ver sección de Recurrente arriba) antes de aceptar pagos reales.
- Tomar capturas de pantalla reales del dispositivo para la ficha de la
  tienda.
- Actualizar el correo de contacto de `/anunciate`, del newsletter y de
  `/privacidad` por uno real antes de publicar.
- **Importante:** este proyecto se preparó desde un entorno Linux en la
  nube, que no tiene el SDK de Android ni Xcode instalados (y no puede
  descargarlos por política de red). Compilar el `.aab` firmado
  (Android) y el archivo de iOS **debe hacerse en tu computadora** con
  Android Studio / Xcode siguiendo los pasos de arriba — el código ya
  está listo, solo falta ese paso final que no se puede hacer de forma
  remota.
