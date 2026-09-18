import Link from "next/link";
import type { Venue } from "@/data/venues";

const precioLabel: Record<number, string> = { 1: "$", 2: "$$", 3: "$$$" };

export default function VenueCard({
  venue,
  distanciaKm,
}: {
  venue: Venue;
  distanciaKm?: number;
}) {
  return (
    <Link
      href={`/lugar/${venue.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-neutral-900 transition hover:-translate-y-1 hover:border-white/30"
    >
      <div
        className="flex h-28 items-center justify-center text-3xl font-bold text-white/90"
        style={{
          background: `linear-gradient(135deg, ${venue.imagenColor}, #0a0a0a)`,
        }}
      >
        {venue.nombre
          .split(" ")
          .map((w) => w[0])
          .slice(0, 2)
          .join("")}
      </div>

      {venue.destacado && (
        <span className="absolute right-3 top-3 rounded-full bg-amber-400 px-2 py-0.5 text-xs font-semibold text-black">
          Destacado
        </span>
      )}

      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-lg font-semibold text-white">{venue.nombre}</h3>
          <span className="shrink-0 rounded-full bg-white/10 px-2 py-0.5 text-xs uppercase tracking-wide text-white/70">
            {venue.tipo}
          </span>
        </div>

        <p className="line-clamp-2 text-sm text-white/60">{venue.descripcion}</p>

        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-white/70">
          <span>⭐ {venue.calificacion.toFixed(1)}</span>
          <span>·</span>
          <span>{precioLabel[venue.precio]}</span>
          {typeof distanciaKm === "number" && (
            <>
              <span>·</span>
              <span>{distanciaKm.toFixed(1)} km</span>
            </>
          )}
        </div>

        {venue.eventoHoy && (
          <div className="mt-2 rounded-lg bg-fuchsia-500/10 px-3 py-2 text-xs text-fuchsia-300">
            🎉 Hoy: {venue.eventoHoy.nombre} · {venue.eventoHoy.hora}
          </div>
        )}
      </div>
    </Link>
  );
}
