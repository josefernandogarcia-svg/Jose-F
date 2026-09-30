/**
 * Integración con Recurrente (recurrente.com), pasarela de pagos
 * guatemalteca (acepta tarjetas locales y paga en quetzales a un banco de
 * Guatemala — a diferencia de Stripe, que no opera con cuentas de Guatemala).
 *
 * ⚠️ IMPORTANTE: no fue posible acceder a la documentación oficial de
 * Recurrente desde este entorno (el proxy de red del sandbox donde se
 * escribió este código bloquea el acceso a su sitio). Este archivo sigue
 * el patrón estándar de una pasarela de pagos con checkout alojado (el
 * mismo que Stripe Checkout u otras), pero los nombres exactos de:
 *   - el endpoint y los headers de autenticación,
 *   - los campos del body y de la respuesta,
 *   - el nombre y formato del header de firma del webhook,
 * DEBEN verificarse contra tu propio dashboard de Recurrente (sección
 * "Developers" / "API") antes de usar esto con dinero real. Ajusta esta
 * función según lo que encuentres ahí — el resto de la app no depende de
 * estos detalles, solo de que `crearSesionDeCheckout` devuelva una URL.
 */

const RECURRENTE_API_URL = "https://app.recurrente.com/api";

export type PlanDePago = "destacado" | "premium";

export const PRECIOS_QUETZALES: Record<PlanDePago, number> = {
  destacado: 250,
  premium: 600,
};

interface CrearCheckoutParams {
  venueId: string;
  plan: PlanDePago;
  emailComprador: string;
  urlExito: string;
  urlCancelado: string;
}

export async function crearSesionDeCheckout({
  venueId,
  plan,
  emailComprador,
  urlExito,
  urlCancelado,
}: CrearCheckoutParams): Promise<string> {
  const publicKey = process.env.RECURRENTE_PUBLIC_KEY;
  const secretKey = process.env.RECURRENTE_SECRET_KEY;
  if (!publicKey || !secretKey) {
    throw new Error(
      "Faltan RECURRENTE_PUBLIC_KEY / RECURRENTE_SECRET_KEY en las variables de entorno."
    );
  }

  const respuesta = await fetch(`${RECURRENTE_API_URL}/checkouts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-PUBLIC-KEY": publicKey,
      "X-SECRET-KEY": secretKey,
    },
    body: JSON.stringify({
      items: [
        {
          name: `GuateLife - Plan ${plan === "destacado" ? "Destacado" : "Premium"}`,
          amount_in_cents: PRECIOS_QUETZALES[plan] * 100,
          currency: "GTQ",
          quantity: 1,
        },
      ],
      customer_email: emailComprador,
      success_url: urlExito,
      cancel_url: urlCancelado,
      metadata: { venueId, plan },
    }),
  });

  if (!respuesta.ok) {
    const texto = await respuesta.text();
    throw new Error(`Recurrente respondió ${respuesta.status}: ${texto}`);
  }

  const datos = await respuesta.json();
  // AJUSTA ESTO: confirma en la respuesta real cuál campo trae la URL de pago.
  const url = datos.checkout_url ?? datos.url;
  if (!url) throw new Error("Recurrente no devolvió una URL de checkout.");
  return url;
}

export interface EventoWebhookRecurrente {
  type: string;
  data: {
    metadata?: { venueId?: string; plan?: PlanDePago };
    customer_id?: string;
    subscription_id?: string;
  };
}

/**
 * AJUSTA ESTO: reemplaza por la verificación real de firma de Recurrente
 * (normalmente HMAC-SHA256 del cuerpo crudo con tu webhook secret, comparado
 * contra un header como `X-Recurrente-Signature`). Mientras tanto, esto solo
 * confirma que configuraste el secreto — NO verifica criptográficamente el
 * origen del request. No actives cobros reales sin completar esto.
 */
export function verificarFirmaWebhook(
  _cuerpoCrudo: string,
  _firma: string | null
): boolean {
  return Boolean(process.env.RECURRENTE_WEBHOOK_SECRET);
}
