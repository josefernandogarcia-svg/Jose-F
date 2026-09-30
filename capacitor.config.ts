import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.guatelife.app',
  appName: 'GuateLife',
  // La app ya no empaqueta archivos estáticos: ahora carga la URL en vivo
  // (necesaria porque hay login, datos por usuario y cobros). Reemplaza
  // esta URL por tu dominio real de Vercel antes de compilar para las
  // tiendas.
  webDir: 'public',
  server: {
    url: 'https://TU-DOMINIO-DE-VERCEL.vercel.app',
    cleartext: false,
  },
};

export default config;
