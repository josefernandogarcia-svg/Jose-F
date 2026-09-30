import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { Venue } from "@/data/venues";

const SELECT_VENUE = `
  id, slug, nombre, tipo, ciudad, direccion, lat, lng, descripcion, tags,
  precio, calificacion, destacado, plan,
  ownerId:owner_id, estadoPago:estado_pago,
  telefono, instagram, sitioWeb:sitio_web, urlReserva:url_reserva,
  imagenColor:imagen_color, fotoPrincipalUrl:foto_principal_url,
  actividadesSemana:venue_actividades(dias, nombre, hora, descripcion)
`;

export async function getAllVenues(): Promise<Venue[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("venues")
    .select(SELECT_VENUE)
    .order("destacado", { ascending: false })
    .order("calificacion", { ascending: false });

  if (error) {
    console.error("Error cargando lugares:", error.message);
    return [];
  }
  return (data as unknown as Venue[]) ?? [];
}

export async function getVenueBySlug(slug: string): Promise<Venue | undefined> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("venues")
    .select(SELECT_VENUE)
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    console.error("Error cargando el lugar:", error.message);
    return undefined;
  }
  return (data as unknown as Venue) ?? undefined;
}

export async function getCiudades(): Promise<string[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("venues").select("ciudad");

  if (error || !data) return [];
  return Array.from(new Set(data.map((v) => v.ciudad))).sort();
}
