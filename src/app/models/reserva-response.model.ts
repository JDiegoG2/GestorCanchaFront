import { Cancha } from "./cancha.model";

export interface ReservaResponse {

id: number;
  fechaReserva: string;
  horaReserva: number;
  cancha: Cancha;
}
