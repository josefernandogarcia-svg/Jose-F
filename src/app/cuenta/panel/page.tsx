import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { tipoIcono, tipoLabel } from "@/data/venues";
import { cerrarSesion } from "../auth-actions";

const planLabel: Record<string, string> = {
  basico: "Básico (gratis)",
  destacado: "Destacado",
  premium: "Premium",
};

export const dynamic = "force-dynamic";

export default async function PanelPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/cuenta/login");

  const { data: lugares } = await supabase
    .from("venues")
    .select("id, nombre, tipo, ciudad, plan, estado_pago, destacado")
    .eq("owner_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Mi panel</h1>
          <p className="mt-1 text-sm text-white/60">{user.email}</p>
        </div>
        <form action={cerrarSesion}>
          <button className="rounded-full border border-white/10 px-4 py-2 text-sm text-white/70 hover:bg-white/5">
            Cerrar sesión
          </button>
        </form>
      </div>

      <Link
        href="/cuenta/panel/nuevo"
        className="mt-8 inline-block rounded-full bg-fuchsia-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-fuchsia-500"
      >
        + Agregar un lugar nuevo
      </Link>

      <div className="mt-8 flex flex-col gap-3">
        {(lugares ?? []).map((l) => (
          <Link
            key={l.id}
            href={`/cuenta/panel/${l.id}`}
            className="flex items-center justify-between rounded-xl border border-white/10 bg-neutral-900/60 p-4 hover:border-white/30"
          >
            <div>
              <p className="font-semibold">
                {tipoIcono[l.tipo as keyof typeof tipoIcono]} {l.nombre}
              </p>
              <p className="text-sm text-white/50">
                {tipoLabel[l.tipo as keyof typeof tipoLabel]} · {l.ciudad}
              </p>
            </div>
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/70">
              {planLabel[l.plan] ?? l.plan}
            </span>
          </Link>
        ))}

        {(!lugares || lugares.length === 0) && (
          <p className="rounded-xl border border-white/10 bg-neutral-900/60 p-6 text-center text-white/60">
            Todavía no tienes ningún lugar publicado.
          </p>
        )}
      </div>
    </div>
  );
}
