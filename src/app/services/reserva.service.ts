import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CanchaResponse } from '../models/cancha-response.model';
import { CrearReservaRequest } from '../models/crear-reserva-request.model';
import { ReservaResponse } from '../models/reserva-response.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ReservaService {

  private apiUrl = 'http://localhost:9000/reserva';  // URL base del API

  constructor(private http: HttpClient, private authService: AuthService) { }

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`  // Incluye el token en los encabezados
    });
  }

  // 1. Listar canchas disponibles por sede
  listarCanchas(sedeId: number): Observable<CanchaResponse[]> {
    return this.http.get<CanchaResponse[]>(`${this.apiUrl}/listar_canchas/${sedeId}`, {headers: this.getHeaders()});
  }

  // 2. Listar horarios disponibles para una cancha en una fecha específica
  listarHorarios(canchaId: number, fecha: string): Observable<number[]> {
    return this.http.get<number[]>(`${this.apiUrl}/listar_horario/${canchaId}/${fecha}`, {headers: this.getHeaders()});
  }

  // 3. Crear una reserva
  crearReserva(request: CrearReservaRequest): Observable<ReservaResponse> {
    return this.http.post<ReservaResponse>(`${this.apiUrl}`, request, {headers: this.getHeaders()});
  }

  // 4. Obtener detalles de una reserva específica
  obtenerReserva(reservaId: number): Observable<ReservaResponse> {
    return this.http.get<ReservaResponse>(`${this.apiUrl}/${reservaId}`, {headers: this.getHeaders()});
  }
}
