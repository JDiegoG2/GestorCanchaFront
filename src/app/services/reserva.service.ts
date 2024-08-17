import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CanchaResponse } from '../models/cancha-response.model';
import { CrearReservaRequest } from '../models/crear-reserva-request.model';
import { AuthService } from './auth.service';
import { ReservaResponse } from '../models/reserva-response.model';

@Injectable({
  providedIn: 'root'
})
export class ReservaService {

  private apiUrl = 'http://localhost:9000/reserva';  // URL base del API

  constructor(private http: HttpClient, private authService: AuthService) { }

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,  // Incluye el token en los encabezados
      'Content-Type': 'application/json'  // Asegura que el contenido sea JSON
    });
  }

  listarCanchas(sedeId: number): Observable<CanchaResponse[]> {
    return this.http.get<CanchaResponse[]>(`${this.apiUrl}/listar_canchas/${sedeId}`, { headers: this.getHeaders() });
  }

  listarHorarios(canchaId: number, fecha: string): Observable<number[]> {
    return this.http.get<number[]>(`${this.apiUrl}/listar_horario/${canchaId}/${fecha}`, { headers: this.getHeaders() });
  }

  crearReserva(request: CrearReservaRequest): Observable<Blob> {
    return this.http.post(`${this.apiUrl}`, request, { headers: this.getHeaders(), responseType: 'blob' });
  }

  obtenerReserva(reservaId: number): Observable<ReservaResponse> {
    return this.http.get<ReservaResponse>(`${this.apiUrl}/${reservaId}`, { headers: this.getHeaders() });
  }
}
