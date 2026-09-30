"use client";

import { useState } from "react";
import { PRECIOS_QUETZALES, type PlanDePago } from "@/lib/pagos/recurrente";

const planLabel: Record<string, string> = {
  basico: "Básico (gratis)",
  destacado: "Destacado",
  premium: "Premium",
};

const estadoLabel: Record<string, string> = {
  sin_pago: "Sin plan de pago",
  activo: "Pago al día",
  vencido: "Pago vencido",
  cancelado: "Cancelado",
};

export default function PlanBilling({
  venueId,
  plan,
  estadoPago,
}: {
  venueId: string;
  plan: string;
  estadoPago: string;
}) {
  const [cargando, setCargando] = useState<PlanDePago | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function suscribirse(planElegido: PlanDePago) {
    setCargando(planElegido);
    setError(null);
    try {
      const res = await fetch("/api/pagos/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ venueId, plan: planElegido }),
      });
      const datos = await res.json();
      if (!res.ok) throw new Error(datos.error ?? "No se pudo iniciar el pago");
      window.location.href = datos.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error inesperado");
      setCargando(null);
    }
  }

  return (
    <div className="rounded-xl border border-white/10 bg-neutral-950 p-4">
      <p className="text-sm text-white/70">
        Plan actual: <strong>{planLabel[plan] ?? plan}</strong>
        {plan !== "basico" && (
          <> · {estadoLabel[estadoPago] ?? estadoPago}</>
        )}
      </p>

      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => suscribirse("destacado")}
          disabled={cargando !== null || plan === "destacado"}
          className="rounded-full bg-fuchsia-600 px-4 py-2 text-sm font-medium text-white hover:bg-fuchsia-500 disabled:opacity-50"
        >
          {cargando === "destacado"
            ? "Redirigiendo..."
            : `Destacado · Q${PRECIOS_QUETZALES.destacado}/mes`}
        </button>
        <button
          type="button"
          onClick={() => suscribirse("premium")}
          disabled={cargando !== null || plan === "premium"}
          className="rounded-full border border-fuchsia-500 px-4 py-2 text-sm font-medium text-fuchsia-300 hover:bg-fuchsia-500/10 disabled:opacity-50"
        >
          {cargando === "premium"
            ? "Redirigiendo..."
            : `Premium · Q${PRECIOS_QUETZALES.premium}/mes`}
        </button>
      </div>

      {error && <p className="mt-2 text-sm text-red-400">{error}</p>}

      <p className="mt-3 text-xs text-white/40">
        El pago se hace con tarjeta, directo con Recurrente. Tu plan se
        activa automáticamente en cuanto se confirme el pago.
      </p>
    </div>
  );
}
