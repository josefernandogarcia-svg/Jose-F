"use client";

import type { Venue } from "@/data/venues";
import { getActividadHoy } from "@/lib/actividades";

export default function ActividadHoy({
  venue,
  variant = "card",
}: {
  venue: Venue;
  variant?: "card" | "detalle";
}) {
  const actividad = getActividadHoy(venue);
  if (!actividad) return null;

  if (variant === "card") {
    return (
      <div className="mt-2 rounded-lg bg-fuchsia-500/10 px-3 py-2 text-xs text-fuchsia-300">
        ✨ Hoy: {actividad.nombre} · {actividad.hora}
      </div>
    );
  }

  return (
    <div className="mt-6 rounded-xl border border-fuchsia-500/30 bg-fuchsia-500/10 p-4">
      <h2 className="font-semibold text-fuchsia-300">
        ✨ Hoy: {actividad.nombre} · {actividad.hora}
      </h2>
      <p className="mt-1 text-sm text-white/70">{actividad.descripcion}</p>
    </div>
  );
}
