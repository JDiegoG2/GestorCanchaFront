import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';  // Importa el servicio de autenticación
import { ReservaResponse } from '../models/reserva-response.model';

@Injectable({
  providedIn: 'root'
})
export class ReporteService {
  private apiUrl = 'http://localhost:9000/reporte';

  constructor(private http: HttpClient, private authService: AuthService) { }

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`  // Incluye el token en los encabezados
    });
  }

  // Método para actualizar el estado de una cancha
  reporteCanchaDia(canchaId: Number, fecha: String): Observable<ReservaResponse[]> {
    // Convierte el estado booleano a 0 o 1
    return this.http.get<ReservaResponse[]>(`${this.apiUrl}/dia/${canchaId}/${fecha}`, { headers: this.getHeaders() });
  }


}