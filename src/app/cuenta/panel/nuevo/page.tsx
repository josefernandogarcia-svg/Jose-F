import { crearLugar } from "../actions";
import LugarForm from "../LugarForm";

export default async function NuevoLugarPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <h1 className="text-2xl font-bold">Agregar un lugar nuevo</h1>
      <p className="mt-2 text-sm text-white/60">
        Se publica de inmediato en el plan Básico (gratis). Podrás pedir
        Destacado o Premium después.
      </p>

      {error && (
        <p className="mt-4 rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-300">
          {error}
        </p>
      )}

      <LugarForm action={crearLugar} />
    </div>
  );
}
