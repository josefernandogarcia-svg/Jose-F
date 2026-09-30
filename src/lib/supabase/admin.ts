import { createClient } from "@supabase/supabase-js";

/**
 * Cliente de Supabase con la llave "service_role": se salta RLS por
 * completo. Úsalo SOLO en rutas de servidor de confianza (como el webhook
 * de pagos) y nunca lo importes desde un componente de cliente.
 */
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}
