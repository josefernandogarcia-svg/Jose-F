import Link from "next/link";
import { iniciarSesion } from "../auth-actions";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="mx-auto max-w-sm px-4 py-16 sm:px-6">
      <h1 className="text-2xl font-bold">Inicia sesión</h1>
      <p className="mt-2 text-sm text-white/60">
        Entra a tu panel para editar tu lugar, sus fotos y sus actividades.
      </p>

      {error && (
        <p className="mt-4 rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-300">
          {error}
        </p>
      )}

      <form action={iniciarSesion} className="mt-6 flex flex-col gap-3">
        <input
          type="email"
          name="email"
          required
          placeholder="tu@correo.com"
          className="rounded-lg border border-white/10 bg-neutral-950 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-fuchsia-400 focus:outline-none"
        />
        <input
          type="password"
          name="password"
          required
          placeholder="Contraseña"
          className="rounded-lg border border-white/10 bg-neutral-950 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-fuchsia-400 focus:outline-none"
        />
        <button
          type="submit"
          className="mt-2 rounded-full bg-fuchsia-600 px-4 py-2 text-sm font-medium text-white hover:bg-fuchsia-500"
        >
          Entrar
        </button>
      </form>

      <p className="mt-6 text-sm text-white/60">
        ¿No tienes cuenta?{" "}
        <Link href="/cuenta/registro" className="text-fuchsia-400 hover:underline">
          Regístrate
        </Link>
      </p>
    </div>
  );
}
