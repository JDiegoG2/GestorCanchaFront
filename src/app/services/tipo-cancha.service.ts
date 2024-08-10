import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';  // Importa el servicio de autenticación

@Injectable({
  providedIn: 'root'
})
export class TipoCanchaService {
  private apiUrl = 'http://localhost:9000/cancha/tipoCancha';

  constructor(private http: HttpClient, private authService: AuthService) { }

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`  // Incluye el token en los encabezados
    });
  }

  getTiposCancha(): Observable<string[]> {
    return this.http.get<string[]>(this.apiUrl, { headers: this.getHeaders() });
  }
}