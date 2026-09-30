import Link from "next/link";
import { registrarse } from "../auth-actions";

export default async function RegistroPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; revisa_correo?: string }>;
}) {
  const { error, revisa_correo } = await searchParams;

  return (
    <div className="mx-auto max-w-sm px-4 py-16 sm:px-6">
      <h1 className="text-2xl font-bold">Crea tu cuenta de negocio</h1>
      <p className="mt-2 text-sm text-white/60">
        Regístrate para publicar y editar tu bar, discoteca, restaurante o
        spot en GuateLife.
      </p>

      {revisa_correo && (
        <p className="mt-4 rounded-lg bg-fuchsia-500/10 px-3 py-2 text-sm text-fuchsia-300">
          Cuenta creada. Revisa tu correo para confirmarla antes de iniciar
          sesión.
        </p>
      )}
      {error && (
        <p className="mt-4 rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-300">
          {error}
        </p>
      )}

      <form action={registrarse} className="mt-6 flex flex-col gap-3">
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
          minLength={6}
          placeholder="Contraseña (mínimo 6 caracteres)"
          className="rounded-lg border border-white/10 bg-neutral-950 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-fuchsia-400 focus:outline-none"
        />
        <button
          type="submit"
          className="mt-2 rounded-full bg-fuchsia-600 px-4 py-2 text-sm font-medium text-white hover:bg-fuchsia-500"
        >
          Crear cuenta
        </button>
      </form>

      <p className="mt-6 text-sm text-white/60">
        ¿Ya tienes cuenta?{" "}
        <Link href="/cuenta/login" className="text-fuchsia-400 hover:underline">
          Inicia sesión
        </Link>
      </p>
    </div>
  );
}
