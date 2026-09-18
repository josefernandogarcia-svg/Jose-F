"use client";

import { useState } from "react";

// Correo donde llegan las suscripciones. Cuando tengas más tráfico,
// reemplaza este flujo por un formulario embebido de un servicio de
// newsletter gratuito (Buttondown, Mailchimp, etc.) — ver README.
const NEWSLETTER_EMAIL = "contacto@guatelife.app";

export default function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [enviado, setEnviado] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;

    const asunto = encodeURIComponent("Suscripción al newsletter de GuateLife");
    const cuerpo = encodeURIComponent(
      `Quiero suscribirme al newsletter de GuateLife con este correo: ${email}`
    );
    window.location.href = `mailto:${NEWSLETTER_EMAIL}?subject=${asunto}&body=${cuerpo}`;
    setEnviado(true);
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-fuchsia-600/20 to-neutral-900 p-6">
      <h2 className="text-lg font-semibold">📬 No te pierdas nada</h2>
      <p className="mt-1 text-sm text-white/60">
        Suscríbete y entérate de nuevos lugares, promociones y eventos
        especiales en Guatemala.
      </p>

      {enviado ? (
        <p className="mt-4 text-sm text-fuchsia-300">
          Se abrió tu correo con la suscripción lista — solo dale enviar. 🎉
        </p>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="mt-4 flex flex-col gap-2 sm:flex-row"
        >
          <input
            type="email"
            required
            placeholder="tu@correo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="min-w-0 flex-1 rounded-lg border border-white/10 bg-neutral-950 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-fuchsia-400 focus:outline-none"
          />
          <button
            type="submit"
            className="rounded-lg bg-fuchsia-600 px-4 py-2 text-sm font-medium text-white hover:bg-fuchsia-500"
          >
            Suscribirme
          </button>
        </form>
      )}
    </div>
  );
}
