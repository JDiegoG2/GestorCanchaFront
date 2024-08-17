import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cancha } from '../models/cancha.model';
import { AuthService } from './auth.service';  // Importa el servicio de autenticación

@Injectable({
  providedIn: 'root'
})
export class CanchaService {
  private apiUrl = 'http://localhost:9000/cancha';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`  // Incluye el token en los encabezados
    });
  }

  // Método para actualizar el estado de una cancha
  actualizarEstado(id: number, estado: boolean): Observable<any> {
    // Convierte el estado booleano a 0 o 1
    const estadoValue = estado ? 1 : 0;
    return this.http.patch(`${this.apiUrl}/estado/${id}`, { estado: estadoValue }, {headers: this.getHeaders()});
  }

  guardarCancha(cancha: Cancha): Observable<Cancha> {
    return this.http.post<Cancha>(`${this.apiUrl}/guardar`, cancha, { headers: this.getHeaders() });
  }

  consultarCancha(id: number): Observable<Cancha> {
    return this.http.get<Cancha>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  eliminarCancha(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  actualizarCancha(id: number, cancha: Cancha): Observable<Cancha> {
    return this.http.patch<Cancha>(`${this.apiUrl}/${id}`, cancha, { headers: this.getHeaders() });
  }

  listarCanchas(): Observable<Cancha[]> {
    return this.http.get<Cancha[]>(`${this.apiUrl}/listar`, { headers: this.getHeaders() });
  }
}