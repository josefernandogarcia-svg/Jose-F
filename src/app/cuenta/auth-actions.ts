"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function registrarse(formData: FormData) {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) {
    redirect(`/cuenta/registro?error=${encodeURIComponent(error.message)}`);
  }

  if (!data.session) {
    // El proyecto de Supabase pide confirmar el correo antes de iniciar sesión
    redirect("/cuenta/registro?revisa_correo=1");
  }

  redirect("/cuenta/panel");
}

export async function iniciarSesion(formData: FormData) {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirect(`/cuenta/login?error=${encodeURIComponent(error.message)}`);
  }

  redirect("/cuenta/panel");
}

export async function cerrarSesion() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
