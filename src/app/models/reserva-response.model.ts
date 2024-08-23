
export interface ReservaResponse {
  id: number;
  fechaCreacion: string;    // Falta la fecha de creación
  fecha_reserva: string;
  hora_reserva: number;
  cancha: string;           // Puede ser una cadena que combine número de cancha y tipo
  observacion: string;      // Falta la observación
  importe: number;          // Falta el importe
  estado: string;           // Falta el estado de la reserva
  cliente: string;          // Falta el cliente que realizó la reserva
  sede: string;
}
