import { getNovedades } from "@/data/novedades";
import NewsletterSignup from "@/components/NewsletterSignup";

function formatearFecha(fecha: string) {
  return new Date(`${fecha}T12:00:00`).toLocaleDateString("es-GT", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function NovedadesPage() {
  const novedades = getNovedades();

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold sm:text-4xl">Novedades ✨</h1>
        <p className="mx-auto mt-3 max-w-xl text-white/60">
          Lo último que está pasando: aperturas, promociones y eventos
          especiales en Guatemala.
        </p>
      </div>

      <div className="mt-10">
        <NewsletterSignup />
      </div>

      <div className="mt-10 flex flex-col gap-4">
        {novedades.map((n) => (
          <article
            key={n.id}
            className="rounded-2xl border border-white/10 bg-neutral-900/60 p-5"
          >
            <p className="text-xs uppercase tracking-wide text-fuchsia-400">
              {formatearFecha(n.fecha)}
            </p>
            <h2 className="mt-1 text-lg font-semibold">{n.titulo}</h2>
            <p className="mt-2 text-sm text-white/70">{n.resumen}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
