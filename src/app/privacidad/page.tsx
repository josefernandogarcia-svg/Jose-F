export const metadata = {
  title: "Política de privacidad · GuateLife",
};

export default function PrivacidadPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 text-sm leading-relaxed text-white/80 sm:px-6">
      <h1 className="text-3xl font-bold text-white">Política de privacidad</h1>
      <p className="mt-2 text-white/50">Última actualización: 2026</p>

      <p className="mt-6">
        GuateLife (&ldquo;la app&rdquo;) es un directorio de bares, discotecas,
        restaurantes y spots en Guatemala. Esta página explica qué
        información se usa cuando utilizas la app.
      </p>

      <h2 className="mt-8 text-xl font-semibold text-white">Ubicación</h2>
      <p className="mt-2">
        Si activas &ldquo;Usar mi ubicación&rdquo;, tu navegador o dispositivo comparte
        tu posición únicamente con la propia app, en tu mismo dispositivo,
        para calcular qué tan cerca están los lugares. Esa ubicación{" "}
        <strong>no se envía a ningún servidor ni se almacena</strong>: GuateLife
        no tiene backend ni base de datos, todo el cálculo ocurre localmente
        en tu teléfono o navegador.
      </p>

      <h2 className="mt-8 text-xl font-semibold text-white">
        Newsletter y contacto
      </h2>
      <p className="mt-2">
        Si te suscribes al newsletter o escribes desde &ldquo;Anúnciate aquí&rdquo;, tu
        correo se envía directamente a la bandeja de contacto de GuateLife
        a través de tu propio programa de correo — no queda guardado dentro
        de la app.
      </p>

      <h2 className="mt-8 text-xl font-semibold text-white">
        Datos de los negocios
      </h2>
      <p className="mt-2">
        La información de bares, restaurantes y spots (nombre, dirección,
        horarios, promociones) es proporcionada por GuateLife o por el
        negocio correspondiente, y se muestra con fines informativos.
      </p>

      <h2 className="mt-8 text-xl font-semibold text-white">
        Cambios a esta política
      </h2>
      <p className="mt-2">
        Podemos actualizar esta política si la app agrega nuevas
        funcionalidades. Los cambios se publicarán en esta misma página.
      </p>

      <h2 className="mt-8 text-xl font-semibold text-white">Contacto</h2>
      <p className="mt-2">
        Para dudas sobre privacidad, escribe a{" "}
        <a
          href="mailto:contacto@guatelife.app"
          className="text-fuchsia-400 hover:underline"
        >
          contacto@guatelife.app
        </a>
        .
      </p>
    </div>
  );
}
