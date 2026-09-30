import type { NextConfig } from "next";

// Ya no exportamos como sitio 100% estático: ahora hay cuentas de usuario,
// subida de fotos y cobros, que necesitan rutas de servidor (API routes) y
// datos en vivo desde Supabase. Se despliega como una app Next.js normal en
// Vercel. Capacitor (Android/iOS) carga la URL en vivo en vez de empaquetar
// archivos estáticos — ver capacitor.config.ts.
const nextConfig: NextConfig = {};

export default nextConfig;
