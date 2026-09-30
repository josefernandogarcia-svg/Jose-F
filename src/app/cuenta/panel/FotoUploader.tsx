"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function FotoUploader({
  venueId,
  fotoActual,
  onSubida,
}: {
  venueId: string;
  fotoActual?: string;
  onSubida: (url: string) => Promise<void>;
}) {
  const [preview, setPreview] = useState<string | undefined>(fotoActual);
  const [subiendo, setSubiendo] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setSubiendo(true);
    setError(null);

    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Sesión expirada, vuelve a iniciar sesión.");

      const extension = file.name.split(".").pop() || "jpg";
      const ruta = `${user.id}/${venueId}/portada.${extension}`;

      const { error: subidaError } = await supabase.storage
        .from("fotos")
        .upload(ruta, file, { upsert: true });
      if (subidaError) throw subidaError;

      const {
        data: { publicUrl },
      } = supabase.storage.from("fotos").getPublicUrl(ruta);

      // Evita que el navegador muestre una copia vieja en caché
      const urlConVersion = `${publicUrl}?v=${Date.now()}`;

      await onSubida(urlConVersion);
      setPreview(urlConVersion);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo subir la foto.");
    } finally {
      setSubiendo(false);
    }
  }

  return (
    <div className="flex flex-col gap-3">
      {preview && (
        // Foto subida por el propio negocio; el dominio viene de su proyecto Supabase.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={preview}
          alt="Foto principal del lugar"
          className="h-40 w-full rounded-xl object-cover"
        />
      )}

      <label className="w-fit cursor-pointer rounded-full border border-white/10 px-4 py-2 text-sm text-white/70 hover:bg-white/5">
        {subiendo ? "Subiendo..." : preview ? "Cambiar foto" : "Subir foto"}
        <input
          type="file"
          accept="image/*"
          onChange={handleFile}
          disabled={subiendo}
          className="hidden"
        />
      </label>

      {error && <p className="text-sm text-red-400">{error}</p>}
    </div>
  );
}
