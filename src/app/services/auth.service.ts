import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Register } from '../models/registerRequest.model';
import { Login } from '../models/loginRequest.model';
import { GenericBean } from '../models/genericBean.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:9000/auth/';  // URL base de tu API

  constructor(private http: HttpClient) { }

  // Método para el login
  login(email: string, password: string): Observable<any> {
    const url = `${this.apiUrl}login`;
    const loginRequest: Login = { email, password };
    return this.http.post<any>(url, loginRequest);
  }

  // Método para el registro
  register(user: Register): Observable<GenericBean> {
    const url = `${this.apiUrl}register`;
    return this.http.post<any>(url, user);
  }
}
