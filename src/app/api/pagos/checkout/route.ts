import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { crearSesionDeCheckout, type PlanDePago } from "@/lib/pagos/recurrente";

export async function POST(req: NextRequest) {
  const { venueId, plan } = (await req.json()) as {
    venueId?: string;
    plan?: PlanDePago;
  };

  if (!venueId || (plan !== "destacado" && plan !== "premium")) {
    return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || !user.email) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const { data: venue } = await supabase
    .from("venues")
    .select("id, owner_id")
    .eq("id", venueId)
    .maybeSingle();

  if (!venue || venue.owner_id !== user.id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  const origin = req.nextUrl.origin;

  try {
    const url = await crearSesionDeCheckout({
      venueId,
      plan,
      emailComprador: user.email,
      urlExito: `${origin}/cuenta/panel/${venueId}?pago=exito`,
      urlCancelado: `${origin}/cuenta/panel/${venueId}?pago=cancelado`,
    });
    return NextResponse.json({ url });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Error creando el pago" },
      { status: 500 }
    );
  }
}
