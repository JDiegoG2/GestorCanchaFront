import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Sede } from '../models/sede.model';
import { AuthService } from './auth.service'; 

@Injectable({
  providedIn: 'root'
})
export class SedeService {
  private apiUrl = 'http://localhost:9000/sede';

  constructor(private http: HttpClient, private authService: AuthService) { }

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`  // Incluye el token en los encabezados
    });
  }

  listarSedes(): Observable<Sede[]> {
    return this.http.get<Sede[]>(`${this.apiUrl}/listar`, { headers: this.getHeaders() });
  }

  obtenerSede(id: number): Observable<Sede> {
    return this.http.get<Sede>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  crearSede(sede: Sede): Observable<Sede> {
    return this.http.post<Sede>(`${this.apiUrl}/guardar`, sede, { headers: this.getHeaders() });
  }

  actualizarSede(id: number, sede: Sede): Observable<Sede> {
    return this.http.put<Sede>(`${this.apiUrl}/${id}`, sede, { headers: this.getHeaders() });
  }

  eliminarSede(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }
}