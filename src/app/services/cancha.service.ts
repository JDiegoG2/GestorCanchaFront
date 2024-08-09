import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cancha } from '../models/cancha.model';
import { ErrorResponse } from '../models/error-response.model';

@Injectable({
  providedIn: 'root'
})
export class CanchaService {
  private apiUrl = 'http://localhost:9000/auth/';

  constructor(private http: HttpClient) {}

  guardarCancha(cancha: Cancha): Observable<Cancha> {
    return this.http.post<Cancha>(`${this.apiUrl}/guardar`, cancha);
  }

  consultarCancha(id: number): Observable<Cancha> {
    return this.http.get<Cancha>(`${this.apiUrl}/${id}`);
  }

  eliminarCancha(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  actualizarCancha(id: number, cancha: Cancha): Observable<Cancha> {
    return this.http.patch<Cancha>(`${this.apiUrl}/${id}`, cancha);
  }

  listarCanchas(): Observable<Cancha[]> {
    return this.http.get<Cancha[]>(`${this.apiUrl}/listar`);
  }
}
