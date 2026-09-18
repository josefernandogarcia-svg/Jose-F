# GuateLife 📍

App web/móvil para descubrir qué hacer en Guatemala: bares, discotecas,
restaurantes y spots (miradores, parques, lugares turísticos), con las
actividades del día, cuáles son los más recomendados, qué tan cerca están
del usuario, y un newsletter con las novedades. Construida con Next.js +
TypeScript + Tailwind CSS, y empaquetada como app nativa con Capacitor.

## Modelo de ingresos (poco esfuerzo, ingresos recurrentes)

La app funciona como **directorio patrocinado**: es gratis para los
usuarios que buscan a dónde ir, y cobra a los negocios (bares, discotecas,
restaurantes, spots) por aparecer con más visibilidad. Todo el cobro y la
publicación se maneja manualmente por ti, sin necesidad de infraestructura
de pagos compleja al inicio.

| Plan | Precio sugerido | Qué obtiene el negocio |
| --- | --- | --- |
| Básico | Gratis | Aparece listado en el directorio |
| Destacado | Q250/mes | Insignia "Destacado", prioridad en resultados, puede publicar la actividad del día |
| Premium | Q600/mes | Todo lo anterior + botón de reservas/enlace de afiliado + banner en portada |

La página `/anunciate` ya incluye los planes y un botón de contacto por
correo para que los dueños de negocios te escriban.

**Fuentes de ingreso adicionales que puedes activar sin mucho esfuerzo:**

- **Enlaces de afiliado/reservas** (`urlReserva` en `src/data/venues.ts`):
  cobra comisión por cada reserva referida (WhatsApp Business, sistemas de
  reservas, venta de boletos como Fever/Eventbrite).
- **Anuncios (Google AdSense)**: una vez la app tenga tráfico, puedes
  añadir un banner de anuncios en `src/app/layout.tsx` sin tocar el resto
  del código.
- **Publicidad de eventos especiales**: cobra por destacar un evento
  puntual (fiesta de fin de año, lanzamiento, promoción de restaurante) en
  la portada o el newsletter por unos días.

Como todo el contenido es estático (no hay base de datos ni backend que
mantener), el costo de operación es prácticamente cero y el mantenimiento
se limita a actualizar `src/data/venues.ts` y `src/data/novedades.ts`
cuando un negocio paga por aparecer o hay algo nuevo que anunciar.

## Cómo agregar o editar lugares

Edita `src/data/venues.ts`. Cada lugar es un objeto con este formato:

```ts
{
  id: "10",
  slug: "nombre-del-lugar", // usado en la URL /lugar/nombre-del-lugar
  nombre: "Nombre del lugar",
  tipo: "bar", // "bar" | "discoteca" | "restaurante" | "spot"
  ciudad: "Guatemala",
  direccion: "Dirección completa",
  lat: 14.6, // coordenadas (Google Maps: click derecho > "¿Qué hay aquí?")
  lng: -90.5,
  descripcion: "Descripción corta y atractiva.",
  tags: ["reggaeton", "rooftop"],
  precio: 2, // 1 = $, 2 = $$, 3 = $$$
  calificacion: 4.5,
  destacado: true, // true si pagó el plan Destacado/Premium
  eventoHoy: { nombre: "Noche de...", hora: "22:00", descripcion: "..." },
  instagram: "https://instagram.com/...",
  urlReserva: "https://wa.me/...", // opcional, enlace de reservas/afiliado
  imagenColor: "#db2777", // color de acento de la tarjeta
}
```

No se necesitan fotos reales: cada tarjeta usa un degradado de color con
las iniciales del lugar, así que publicar un lugar nuevo toma minutos.

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
- **Anúnciate aquí** (`/anunciate`): planes de monetización para dueños de
  negocios, con contacto directo.

## Desarrollo local

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

## Producción

```bash
npm run build   # genera el sitio estático en out/
npm run start   # sirve out/ localmente para probarlo
```

## Desplegar gratis (recomendado: Vercel)

1. Sube este repositorio a GitHub (ya está listo).
2. Entra a [vercel.com/new](https://vercel.com/new), importa el repo y
   despliega — no requiere configuración adicional.
3. Cada vez que edites `src/data/venues.ts` o `src/data/novedades.ts` y
   hagas push, el sitio se actualiza solo.

Con hosting gratuito (Vercel) y sin base de datos que mantener, el único
trabajo recurrente es cobrar a los negocios y actualizar sus datos.

## App nativa (Android/iOS) con Capacitor

El proyecto ya está preparado para empaquetarse como app nativa con
[Capacitor](https://capacitorjs.com):

- `next.config.ts` usa `output: "export"` (exporta HTML/CSS/JS estático a
  `out/`, sin servidor) y `trailingSlash: true` (para que las rutas
  profundas como `/lugar/kloud-discoteca` carguen bien dentro del
  contenedor nativo).
- `capacitor.config.ts` define el id de la app (`com.guatelife.app`) y que
  el contenido sale de `out/`.
- Las carpetas `android/` y `ios/` son los proyectos nativos generados
  (ya están en el repo, listos para abrir en Android Studio / Xcode).

### Flujo de trabajo

Cada vez que cambies algo (ej. `src/data/venues.ts`), sincroniza los
proyectos nativos con:

```bash
npm run cap:sync   # next build + npx cap sync
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

### Antes de publicar en las tiendas

- Reemplazar el ícono y splash screen por defecto (`npx @capacitor/assets generate`
  a partir de un logo propio).
- Escribir una política de privacidad (obligatoria en ambas tiendas) y
  enlazarla en la ficha de la app.
- Tomar capturas de pantalla reales del dispositivo para la ficha de la
  tienda.
- Actualizar el correo de contacto de `/anunciate` y del newsletter por
  uno real antes de publicar.
