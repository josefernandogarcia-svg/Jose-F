import type { Venue, VenueEvent } from "@/data/venues";

/**
 * Calcula la actividad "de hoy" de un lugar según el día real (no una fecha
 * fija): busca en `actividadesSemana` la que aplica al día de hoy.
 */
export function getActividadHoy(venue: Venue): VenueEvent | undefined {
  if (!venue.actividadesSemana?.length) return undefined;
  const hoy = new Date().getDay();
  return venue.actividadesSemana.find((a) => a.dias.includes(hoy));
}
