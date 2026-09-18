export interface Novedad {
  id: string;
  fecha: string; // formato: "2026-09-18"
  titulo: string;
  resumen: string;
}

// Edita esta lista para publicar novedades: aperturas, promociones,
// eventos especiales. Se muestran de más reciente a más antigua.
export const novedades: Novedad[] = [
  {
    id: "1",
    fecha: "2026-09-15",
    titulo: "¡GuateLife ya está en línea! 🎉",
    resumen:
      "Lanzamos la primera versión: bares, discotecas, restaurantes y spots de Guatemala en un solo lugar, con las actividades del día y qué tan cerca están de ti.",
  },
  {
    id: "2",
    fecha: "2026-09-10",
    titulo: "Nuevo: filtro por spots y restaurantes",
    resumen:
      "Ahora puedes explorar no solo vida nocturna, sino también restaurantes recomendados y spots para el día (miradores, parques, lugares turísticos).",
  },
  {
    id: "3",
    fecha: "2026-09-01",
    titulo: "¿Tienes un negocio? Publícalo gratis",
    resumen:
      "Bares, discotecas, restaurantes y spots pueden aparecer gratis en el directorio, con opción a plan Destacado para más visibilidad. Ve a 'Anúnciate aquí'.",
  },
];

export function getNovedades(): Novedad[] {
  return [...novedades].sort((a, b) => (a.fecha < b.fecha ? 1 : -1));
}
