export interface CrearReservaRequest {

    canchaId: number;
    clienteId?: number;
    fechaReserva: string;
    horaReserva: number;
    observacion?: string;
    importe: number;
  }