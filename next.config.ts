import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Exporta HTML/CSS/JS 100% estático a `out/`, necesario para empaquetar
  // la app con Capacitor (iOS/Android) y servirla desde el propio dispositivo.
  output: "export",
  // Genera out/lugar/slug/index.html en vez de out/lugar/slug.html para que
  // el servidor local de Capacitor resuelva rutas profundas correctamente.
  trailingSlash: true,
};

export default nextConfig;
