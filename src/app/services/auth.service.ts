import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Register } from '../models/registerRequest.model';
import { Login } from '../models/loginRequest.model';
import { ErrorResponse } from '../models/error-response.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:9000/auth/'; 

  constructor(private http: HttpClient) { }

  // Método para el login
  login(email: string, password: string): Observable<any> {
    const url = `${this.apiUrl}login`;
    const loginRequest: Login = { email, password };
    return this.http.post<any>(url, loginRequest);
  }

  // Método para el registro
  register(user: Register): Observable<ErrorResponse> {
    const url = `${this.apiUrl}register`;
    return this.http.post<any>(url, user);
  }

  // Guardar el token en localStorage
  saveToken(token: string): void {
    localStorage.setItem('token', token);
  }

  // Obtener el token desde localStorage
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Eliminar el token (logout)
  logout(): void {
    localStorage.removeItem('token');
  }
}
