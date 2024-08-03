import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Register } from '../models/registerRequest.model';
import { Login } from '../models/loginRequest.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:9000/';  // URL base de tu API

  constructor(private http: HttpClient) {}

  // Método para el login
  login(username: string, password: string): Observable<any> {
    const url = `${this.apiUrl}login`;
    const loginRequest: Login = { username, password };
    return this.http.post<any>(url, loginRequest);
  }

  // Método para el registro
  register(user: Register): Observable<any> {
    const url = `${this.apiUrl}register`;
    return this.http.post<any>(url, user);
  }
}
