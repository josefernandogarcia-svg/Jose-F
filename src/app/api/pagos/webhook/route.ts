import { NextRequest, NextResponse } from "next/server";
import {
  verificarFirmaWebhook,
  type EventoWebhookRecurrente,
} from "@/lib/pagos/recurrente";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(req: NextRequest) {
  const cuerpoCrudo = await req.text();
  // AJUSTA ESTO: confirma el nombre real del header de firma en la
  // documentación de Recurrente.
  const firma = req.headers.get("x-recurrente-signature");

  if (!verificarFirmaWebhook(cuerpoCrudo, firma)) {
    return NextResponse.json({ error: "Firma inválida" }, { status: 401 });
  }

  const evento = JSON.parse(cuerpoCrudo) as EventoWebhookRecurrente;
  const venueId = evento.data?.metadata?.venueId;
  const plan = evento.data?.metadata?.plan;

  if (!venueId) {
    return NextResponse.json({ received: true });
  }

  const supabase = createAdminClient();

  // AJUSTA ESTO: los nombres exactos de `evento.type` dependen de
  // Recurrente; aquí se cubren los tres casos típicos de cualquier
  // pasarela con suscripciones (pago exitoso / cancelado o fallido).
  if (evento.type.includes("succeeded") || evento.type.includes("completed")) {
    await supabase
      .from("venues")
      .update({ plan, estado_pago: "activo", destacado: true })
      .eq("id", venueId);

    await supabase.from("suscripciones").upsert(
      {
        venue_id: venueId,
        plan,
        estado: "activo",
        proveedor_customer_id: evento.data.customer_id,
        proveedor_subscription_id: evento.data.subscription_id,
      },
      { onConflict: "venue_id" }
    );
  } else if (evento.type.includes("canceled") || evento.type.includes("failed")) {
    await supabase
      .from("venues")
      .update({ estado_pago: "cancelado", destacado: false, plan: "basico" })
      .eq("id", venueId);

    await supabase
      .from("suscripciones")
      .update({ estado: "cancelado" })
      .eq("venue_id", venueId);
  }

  return NextResponse.json({ received: true });
}
