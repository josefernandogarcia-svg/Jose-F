import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllVenues, getVenueBySlug } from "@/data/venues";

const precioLabel: Record<number, string> = { 1: "$", 2: "$$", 3: "$$$" };

export function generateStaticParams() {
  return getAllVenues().map((v) => ({ slug: v.slug }));
}

export default async function VenuePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const venue = getVenueBySlug(slug);
  if (!venue) notFound();

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${venue.lat},${venue.lng}`;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <Link href="/" className="text-sm text-white/60 hover:text-white">
        ← Volver a explorar
      </Link>

      <div
        className="mt-4 flex h-40 items-center justify-center rounded-2xl text-4xl font-bold text-white/90"
        style={{
          background: `linear-gradient(135deg, ${venue.imagenColor}, #0a0a0a)`,
        }}
      >
        {venue.nombre}
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <span className="rounded-full bg-white/10 px-3 py-1 text-xs uppercase tracking-wide">
          {venue.tipo}
        </span>
        {venue.destacado && (
          <span className="rounded-full bg-amber-400 px-3 py-1 text-xs font-semibold text-black">
            Destacado
          </span>
        )}
        <span className="text-sm text-white/70">
          ⭐ {venue.calificacion.toFixed(1)} · {precioLabel[venue.precio]}
        </span>
      </div>

      <p className="mt-4 text-white/80">{venue.descripcion}</p>

      <div className="mt-2 flex flex-wrap gap-2">
        {venue.tags.map((t) => (
          <span
            key={t}
            className="rounded-full bg-white/5 px-3 py-1 text-xs text-white/60"
          >
            #{t}
          </span>
        ))}
      </div>

      {venue.eventoHoy && (
        <div className="mt-6 rounded-xl border border-fuchsia-500/30 bg-fuchsia-500/10 p-4">
          <h2 className="font-semibold text-fuchsia-300">
            🎉 Hoy: {venue.eventoHoy.nombre} · {venue.eventoHoy.hora}
          </h2>
          <p className="mt-1 text-sm text-white/70">
            {venue.eventoHoy.descripcion}
          </p>
        </div>
      )}

      <div className="mt-8 grid gap-4 rounded-xl border border-white/10 bg-neutral-900/60 p-5 sm:grid-cols-2">
        <div>
          <h3 className="text-sm font-semibold text-white/50">Dirección</h3>
          <p className="text-white/90">{venue.direccion}</p>
          <p className="text-white/60">{venue.ciudad}</p>
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-block text-sm text-fuchsia-400 hover:underline"
          >
            Ver en el mapa →
          </a>
        </div>

        <div className="flex flex-col gap-1">
          <h3 className="text-sm font-semibold text-white/50">Contacto</h3>
          {venue.telefono && <p className="text-white/90">{venue.telefono}</p>}
          {venue.instagram && (
            <a
              href={venue.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="text-fuchsia-400 hover:underline"
            >
              Instagram
            </a>
          )}
          {venue.sitioWeb && (
            <a
              href={venue.sitioWeb}
              target="_blank"
              rel="noopener noreferrer"
              className="text-fuchsia-400 hover:underline"
            >
              Sitio web
            </a>
          )}
        </div>
      </div>

      {venue.urlReserva && (
        <a
          href={venue.urlReserva}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-block rounded-full bg-fuchsia-600 px-6 py-3 font-medium text-white hover:bg-fuchsia-500"
        >
          Reservar / Más información
        </a>
      )}
    </div>
  );
}
