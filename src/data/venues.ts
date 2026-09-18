export type VenueType = "bar" | "discoteca";

export interface VenueEvent {
  nombre: string;
  hora: string;
  descripcion: string;
}

export interface Venue {
  id: string;
  slug: string;
  nombre: string;
  tipo: VenueType;
  ciudad: string;
  direccion: string;
  lat: number;
  lng: number;
  descripcion: string;
  tags: string[];
  precio: 1 | 2 | 3; // $ a $$$
  calificacion: number; // 0 a 5
  destacado: boolean; // listado patrocinado (fuente de ingresos)
  eventoHoy?: VenueEvent;
  telefono?: string;
  instagram?: string;
  sitioWeb?: string;
  /** Enlace de afiliado/reservas: comisión por cada reserva (fuente de ingresos) */
  urlReserva?: string;
  imagenColor: string; // color de acento para la tarjeta (sin necesidad de fotos reales)
}

// Datos de ejemplo para Ciudad de Guatemala (Zona Viva). Reemplaza con lugares
// reales de tu ciudad: nombre, dirección, coordenadas (lat/lng) y detalles.
export const venues: Venue[] = [
  {
    id: "1",
    slug: "alux-bar",
    nombre: "Alux Bar",
    tipo: "bar",
    ciudad: "Guatemala",
    direccion: "12 Calle 4-30, Zona 10",
    lat: 14.5975,
    lng: -90.5133,
    descripcion:
      "Bar subterráneo con ambiente místico, coctelería de autor y música en vivo los jueves.",
    tags: ["música en vivo", "coctelería", "ambiente único"],
    precio: 2,
    calificacion: 4.6,
    destacado: true,
    eventoHoy: {
      nombre: "Jazz Nocturno",
      hora: "21:00",
      descripcion: "Trío de jazz en vivo, entrada libre con consumo mínimo.",
    },
    instagram: "https://instagram.com/aluxbar",
    urlReserva: "https://wa.me/50212345678",
    imagenColor: "#7c3aed",
  },
  {
    id: "2",
    slug: "kloud-discoteca",
    nombre: "Kloud",
    tipo: "discoteca",
    ciudad: "Guatemala",
    direccion: "4 Grados Norte, Zona 4",
    lat: 14.6146,
    lng: -90.5165,
    descripcion:
      "La discoteca más famosa de la zona, con los mejores DJs invitados y pista principal.",
    tags: ["EDM", "DJ invitado", "rooftop"],
    precio: 3,
    calificacion: 4.8,
    destacado: true,
    eventoHoy: {
      nombre: "Noche de DJ Internacional",
      hora: "23:00",
      descripcion: "Line-up especial de fin de semana, boletos anticipados recomendados.",
    },
    sitioWeb: "https://example.com/kloud",
    urlReserva: "https://example.com/kloud/reservas",
    imagenColor: "#db2777",
  },
  {
    id: "3",
    slug: "la-terraza",
    nombre: "La Terraza",
    tipo: "bar",
    ciudad: "Guatemala",
    direccion: "6 Avenida 13-01, Zona 10",
    lat: 14.5952,
    lng: -90.5104,
    descripcion:
      "Bar al aire libre ideal para after-office, con happy hour todos los días.",
    tags: ["happy hour", "al aire libre", "after-office"],
    precio: 1,
    calificacion: 4.2,
    destacado: false,
    eventoHoy: {
      nombre: "Happy Hour Extendido",
      hora: "17:00",
      descripcion: "2x1 en cocteles seleccionados hasta las 20:00.",
    },
    imagenColor: "#059669",
  },
  {
    id: "4",
    slug: "envy-club",
    nombre: "Envy Club",
    tipo: "discoteca",
    ciudad: "Guatemala",
    direccion: "Diagonal 6 10-01, Zona 10",
    lat: 14.5968,
    lng: -90.5089,
    descripcion: "Discoteca exclusiva con sección VIP y los mejores remixes urbanos.",
    tags: ["reggaeton", "VIP", "urbano"],
    precio: 3,
    calificacion: 4.4,
    destacado: false,
    telefono: "+502 1234 5678",
    imagenColor: "#ea580c",
  },
  {
    id: "5",
    slug: "cheers-pub",
    nombre: "Cheers Pub",
    tipo: "bar",
    ciudad: "Guatemala",
    direccion: "1 Avenida 15-15, Zona 10",
    lat: 14.6011,
    lng: -90.5121,
    descripcion: "Pub estilo americano con deportes en vivo y buena cerveza artesanal.",
    tags: ["deportes en vivo", "cerveza artesanal", "trivia"],
    precio: 2,
    calificacion: 4.0,
    destacado: false,
    eventoHoy: {
      nombre: "Noche de Trivia",
      hora: "19:30",
      descripcion: "Concurso de trivia con premios para el equipo ganador.",
    },
    imagenColor: "#0284c7",
  },
];

export function getAllVenues(): Venue[] {
  return venues;
}

export function getVenueBySlug(slug: string): Venue | undefined {
  return venues.find((v) => v.slug === slug);
}

export function getCiudades(): string[] {
  return Array.from(new Set(venues.map((v) => v.ciudad))).sort();
}
