"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

async function usuarioActual() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/cuenta/login");
  return { supabase, user };
}

function slugify(texto: string) {
  return texto
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function datosDeLugar(formData: FormData) {
  return {
    nombre: String(formData.get("nombre") ?? ""),
    tipo: String(formData.get("tipo") ?? "bar"),
    ciudad: String(formData.get("ciudad") ?? ""),
    direccion: String(formData.get("direccion") ?? ""),
    lat: Number(formData.get("lat") ?? 0),
    lng: Number(formData.get("lng") ?? 0),
    descripcion: String(formData.get("descripcion") ?? ""),
    tags: String(formData.get("tags") ?? "")
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean),
    precio: Number(formData.get("precio") ?? 2),
    telefono: String(formData.get("telefono") ?? "") || null,
    instagram: String(formData.get("instagram") ?? "") || null,
    sitio_web: String(formData.get("sitioWeb") ?? "") || null,
    url_reserva: String(formData.get("urlReserva") ?? "") || null,
    imagen_color: String(formData.get("imagenColor") ?? "#db2777"),
  };
}

export async function crearLugar(formData: FormData) {
  const { supabase, user } = await usuarioActual();
  const datos = datosDeLugar(formData);
  const slugBase = slugify(datos.nombre) || "lugar";
  const slug = `${slugBase}-${Math.random().toString(36).slice(2, 7)}`;

  const { data, error } = await supabase
    .from("venues")
    .insert({ ...datos, slug, owner_id: user.id })
    .select("id")
    .single();

  if (error || !data) {
    redirect(
      `/cuenta/panel/nuevo?error=${encodeURIComponent(error?.message ?? "No se pudo crear el lugar")}`
    );
  }

  revalidatePath("/");
  redirect(`/cuenta/panel/${data.id}`);
}

export async function actualizarLugar(venueId: string, formData: FormData) {
  const { supabase } = await usuarioActual();
  const datos = datosDeLugar(formData);

  // RLS ya impide editar un lugar que no es tuyo (owner_id = auth.uid())
  const { error } = await supabase.from("venues").update(datos).eq("id", venueId);

  if (error) {
    redirect(
      `/cuenta/panel/${venueId}?error=${encodeURIComponent(error.message)}`
    );
  }

  revalidatePath("/");
  revalidatePath(`/cuenta/panel/${venueId}`);
  redirect(`/cuenta/panel/${venueId}?ok=1`);
}

export async function actualizarActividades(
  venueId: string,
  actividades: { dias: number[]; nombre: string; hora: string; descripcion: string }[]
) {
  const { supabase } = await usuarioActual();

  await supabase.from("venue_actividades").delete().eq("venue_id", venueId);

  const filas = actividades
    .filter((a) => a.nombre.trim() && a.dias.length > 0)
    .map((a) => ({ venue_id: venueId, ...a }));

  if (filas.length > 0) {
    await supabase.from("venue_actividades").insert(filas);
  }

  revalidatePath("/");
  revalidatePath(`/cuenta/panel/${venueId}`);
}

export async function actualizarFotoPrincipal(venueId: string, url: string) {
  const { supabase } = await usuarioActual();
  await supabase
    .from("venues")
    .update({ foto_principal_url: url })
    .eq("id", venueId);

  revalidatePath("/");
  revalidatePath(`/cuenta/panel/${venueId}`);
}

export async function eliminarLugar(venueId: string) {
  const { supabase } = await usuarioActual();
  await supabase.from("venues").delete().eq("id", venueId);
  revalidatePath("/");
  redirect("/cuenta/panel");
}
