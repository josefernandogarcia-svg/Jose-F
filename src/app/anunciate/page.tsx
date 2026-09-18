const planes = [
  {
    nombre: "Básico",
    precio: "Gratis",
    detalle: "Tu lugar aparece listado en el directorio.",
    incluye: ["Ficha con dirección y contacto", "Aparece en búsquedas y filtros"],
  },
  {
    nombre: "Destacado",
    precio: "Q250/mes",
    detalle: "Prioridad en los resultados y más visibilidad.",
    incluye: [
      "Insignia 'Destacado' en tu ficha",
      "Apareces primero en 'Recomendados'",
      "Puedes publicar la actividad del día",
    ],
    popular: true,
  },
  {
    nombre: "Premium",
    precio: "Q600/mes",
    detalle: "Máxima visibilidad + enlace de reservas.",
    incluye: [
      "Todo lo de Destacado",
      "Botón de reservas/enlace de afiliado",
      "Banner especial en la portada",
    ],
  },
];

export default function AnunciatePage() {
  const asunto = encodeURIComponent("Quiero anunciar mi negocio en GuateLife");
  const cuerpo = encodeURIComponent(
    "Hola,\n\nMe gustaria publicar mi negocio en GuateLife.\n\nNombre del lugar:\nTipo (bar/discoteca/restaurante/spot):\nCiudad:\nDireccion:\nPlan de interes:\n\nGracias."
  );

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold sm:text-4xl">
          Lleva más gente a tu negocio
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-white/60">
          Miles de personas buscan a dónde ir en Guatemala: bares,
          discotecas, restaurantes y spots. Publica tu negocio, destaca tus
          actividades y llena tu local sin esfuerzo extra.
        </p>
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-3">
        {planes.map((plan) => (
          <div
            key={plan.nombre}
            className={`flex flex-col rounded-2xl border p-6 ${
              plan.popular
                ? "border-fuchsia-500 bg-fuchsia-500/10"
                : "border-white/10 bg-neutral-900/60"
            }`}
          >
            {plan.popular && (
              <span className="mb-2 w-fit rounded-full bg-fuchsia-500 px-3 py-1 text-xs font-semibold text-white">
                Más elegido
              </span>
            )}
            <h2 className="text-xl font-semibold">{plan.nombre}</h2>
            <p className="mt-1 text-2xl font-bold text-fuchsia-400">
              {plan.precio}
            </p>
            <p className="mt-2 text-sm text-white/60">{plan.detalle}</p>
            <ul className="mt-4 flex-1 space-y-2 text-sm text-white/80">
              {plan.incluye.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="text-fuchsia-400">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-10 rounded-2xl border border-white/10 bg-neutral-900/60 p-6 text-center">
        <h2 className="text-lg font-semibold">¿Listo para aparecer?</h2>
        <p className="mt-2 text-white/60">
          Escríbenos y en menos de 24 horas tu lugar está publicado.
        </p>
        <a
          href={`mailto:contacto@guatelife.app?subject=${asunto}&body=${cuerpo}`}
          className="mt-4 inline-block rounded-full bg-fuchsia-600 px-6 py-3 font-medium text-white hover:bg-fuchsia-500"
        >
          Escribir a contacto@guatelife.app
        </a>
      </div>
    </div>
  );
}
