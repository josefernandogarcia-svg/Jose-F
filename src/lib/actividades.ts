import type { Venue, VenueEvent } from "@/data/venues";

/**
 * Calcula la actividad "de hoy" de un lugar según el día real (no una fecha
 * fija). Si el lugar tiene `actividadesSemana`, busca la que aplica al día
 * de hoy; si no, usa el campo estático `eventoHoy` como respaldo.
 */
export function getActividadHoy(venue: Venue): VenueEvent | undefined {
  if (venue.actividadesSemana?.length) {
    const hoy = new Date().getDay();
    return venue.actividadesSemana.find((a) => a.dias.includes(hoy));
  }
  return venue.eventoHoy;
}
