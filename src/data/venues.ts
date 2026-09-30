export type VenueType = "bar" | "discoteca" | "restaurante" | "spot";
export type VenuePlan = "basico" | "destacado" | "premium";
export type EstadoPago = "sin_pago" | "activo" | "vencido" | "cancelado";

export const tipoLabel: Record<VenueType, string> = {
  bar: "Bar",
  discoteca: "Discoteca",
  restaurante: "Restaurante",
  spot: "Spot",
};

export const tipoIcono: Record<VenueType, string> = {
  bar: "🍸",
  discoteca: "🎉",
  restaurante: "🍽️",
  spot: "📍",
};

export interface VenueEvent {
  nombre: string;
  hora: string;
  descripcion: string;
}

export interface ActividadProgramada extends VenueEvent {
  /** Días en que aplica: 0 = domingo, 1 = lunes, ... 6 = sábado */
  dias: number[];
}

export interface Venue {
  id: string;
  /** null = lugar curado por el administrador; con valor = lo creó su dueño */
  ownerId: string | null;
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
  plan: VenuePlan;
  estadoPago: EstadoPago;
  /** Horario semanal recurrente: la app calcula sola qué actividad mostrar
   * según el día real, sin necesidad de editar nada manualmente. */
  actividadesSemana?: ActividadProgramada[];
  telefono?: string;
  instagram?: string;
  sitioWeb?: string;
  /** Enlace de afiliado/reservas: comisión por cada reserva (fuente de ingresos) */
  urlReserva?: string;
  imagenColor: string; // color de acento para la tarjeta (respaldo si no hay foto)
  fotoPrincipalUrl?: string | null;
}
