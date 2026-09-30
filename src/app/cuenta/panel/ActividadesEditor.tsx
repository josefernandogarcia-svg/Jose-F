"use client";

import { useState, useTransition } from "react";
import type { ActividadProgramada } from "@/data/venues";

const DIAS = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

type Actividad = ActividadProgramada;

export default function ActividadesEditor({
  actividadesIniciales,
  onGuardar,
}: {
  actividadesIniciales: Actividad[];
  onGuardar: (actividades: Actividad[]) => Promise<void>;
}) {
  const [actividades, setActividades] = useState<Actividad[]>(
    actividadesIniciales.length > 0
      ? actividadesIniciales
      : []
  );
  const [pendiente, iniciarTransicion] = useTransition();
  const [guardado, setGuardado] = useState(false);

  function actualizar(i: number, cambios: Partial<Actividad>) {
    setActividades((prev) =>
      prev.map((a, idx) => (idx === i ? { ...a, ...cambios } : a))
    );
    setGuardado(false);
  }

  function alternarDia(i: number, dia: number) {
    setActividades((prev) =>
      prev.map((a, idx) => {
        if (idx !== i) return a;
        const dias = a.dias.includes(dia)
          ? a.dias.filter((d) => d !== dia)
          : [...a.dias, dia].sort();
        return { ...a, dias };
      })
    );
    setGuardado(false);
  }

  function agregar() {
    setActividades((prev) => [
      ...prev,
      { dias: [], nombre: "", hora: "20:00", descripcion: "" },
    ]);
  }

  function eliminar(i: number) {
    setActividades((prev) => prev.filter((_, idx) => idx !== i));
    setGuardado(false);
  }

  function guardar() {
    iniciarTransicion(async () => {
      await onGuardar(actividades);
      setGuardado(true);
    });
  }

  return (
    <div className="flex flex-col gap-4">
      {actividades.map((a, i) => (
        <div
          key={i}
          className="rounded-xl border border-white/10 bg-neutral-950 p-4"
        >
          <div className="flex flex-wrap gap-1.5">
            {DIAS.map((etiqueta, dia) => (
              <button
                key={dia}
                type="button"
                onClick={() => alternarDia(i, dia)}
                className={`rounded-full px-2.5 py-1 text-xs ${
                  a.dias.includes(dia)
                    ? "bg-fuchsia-600 text-white"
                    : "bg-white/5 text-white/50"
                }`}
              >
                {etiqueta}
              </button>
            ))}
          </div>

          <div className="mt-3 grid grid-cols-3 gap-2">
            <input
              placeholder="Nombre (ej. Noche de Jazz)"
              value={a.nombre}
              onChange={(e) => actualizar(i, { nombre: e.target.value })}
              className="input col-span-2"
            />
            <input
              type="time"
              value={a.hora}
              onChange={(e) => actualizar(i, { hora: e.target.value })}
              className="input"
            />
          </div>
          <textarea
            placeholder="Descripción corta"
            value={a.descripcion}
            onChange={(e) => actualizar(i, { descripcion: e.target.value })}
            rows={2}
            className="input mt-2"
          />

          <button
            type="button"
            onClick={() => eliminar(i)}
            className="mt-2 text-xs text-red-400 hover:underline"
          >
            Eliminar esta actividad
          </button>
        </div>
      ))}

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={agregar}
          className="rounded-full border border-white/10 px-4 py-2 text-sm text-white/70 hover:bg-white/5"
        >
          + Agregar actividad
        </button>
        <button
          type="button"
          onClick={guardar}
          disabled={pendiente}
          className="rounded-full bg-fuchsia-600 px-4 py-2 text-sm font-medium text-white hover:bg-fuchsia-500 disabled:opacity-60"
        >
          {pendiente ? "Guardando..." : "Guardar horario"}
        </button>
        {guardado && (
          <span className="text-sm text-fuchsia-300">Guardado ✓</span>
        )}
      </div>
    </div>
  );
}
