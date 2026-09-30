"use client";

import type { Venue } from "@/data/venues";

export default function LugarForm({
  action,
  valoresIniciales,
}: {
  action: (formData: FormData) => void;
  valoresIniciales?: Partial<Venue>;
}) {
  const v = valoresIniciales;

  return (
    <form action={action} className="mt-6 flex flex-col gap-4">
      <Campo label="Nombre del lugar">
        <input
          name="nombre"
          required
          defaultValue={v?.nombre}
          className="input"
        />
      </Campo>

      <div className="grid grid-cols-2 gap-4">
        <Campo label="Tipo">
          <select name="tipo" defaultValue={v?.tipo ?? "bar"} className="input">
            <option value="bar">🍸 Bar</option>
            <option value="discoteca">🎉 Discoteca</option>
            <option value="restaurante">🍽️ Restaurante</option>
            <option value="spot">📍 Spot</option>
          </select>
        </Campo>
        <Campo label="Precio">
          <select name="precio" defaultValue={v?.precio ?? 2} className="input">
            <option value={1}>$</option>
            <option value={2}>$$</option>
            <option value={3}>$$$</option>
          </select>
        </Campo>
      </div>

      <Campo label="Ciudad">
        <input
          name="ciudad"
          required
          defaultValue={v?.ciudad ?? "Guatemala"}
          className="input"
        />
      </Campo>

      <Campo label="Dirección">
        <input
          name="direccion"
          required
          defaultValue={v?.direccion}
          className="input"
        />
      </Campo>

      <div className="grid grid-cols-2 gap-4">
        <Campo label="Latitud">
          <input
            name="lat"
            type="number"
            step="any"
            required
            defaultValue={v?.lat}
            className="input"
          />
        </Campo>
        <Campo label="Longitud">
          <input
            name="lng"
            type="number"
            step="any"
            required
            defaultValue={v?.lng}
            className="input"
          />
        </Campo>
      </div>
      <p className="-mt-2 text-xs text-white/40">
        En Google Maps: clic derecho sobre tu ubicación → copia las
        coordenadas.
      </p>

      <Campo label="Descripción">
        <textarea
          name="descripcion"
          required
          rows={3}
          defaultValue={v?.descripcion}
          className="input"
        />
      </Campo>

      <Campo label="Etiquetas (separadas por coma)">
        <input
          name="tags"
          placeholder="rooftop, música en vivo, happy hour"
          defaultValue={v?.tags?.join(", ")}
          className="input"
        />
      </Campo>

      <div className="grid grid-cols-2 gap-4">
        <Campo label="Teléfono (opcional)">
          <input name="telefono" defaultValue={v?.telefono} className="input" />
        </Campo>
        <Campo label="Instagram (opcional)">
          <input
            name="instagram"
            placeholder="https://instagram.com/..."
            defaultValue={v?.instagram}
            className="input"
          />
        </Campo>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Campo label="Sitio web (opcional)">
          <input
            name="sitioWeb"
            placeholder="https://..."
            defaultValue={v?.sitioWeb}
            className="input"
          />
        </Campo>
        <Campo label="Enlace de reservas (opcional)">
          <input
            name="urlReserva"
            placeholder="https://wa.me/..."
            defaultValue={v?.urlReserva}
            className="input"
          />
        </Campo>
      </div>

      <Campo label="Color de la tarjeta">
        <input
          name="imagenColor"
          type="color"
          defaultValue={v?.imagenColor ?? "#db2777"}
          className="h-10 w-20 rounded border border-white/10 bg-neutral-950"
        />
      </Campo>

      <button
        type="submit"
        className="mt-2 rounded-full bg-fuchsia-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-fuchsia-500"
      >
        Guardar
      </button>
    </form>
  );
}

function Campo({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1 text-sm text-white/70">
      {label}
      {children}
    </label>
  );
}
