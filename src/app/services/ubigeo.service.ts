import { HttpClient, HttpHeaders } from '@angular/common/http';
 import { Injectable } from '@angular/core';
 import { Observable } from 'rxjs';

 @Injectable({
   providedIn: 'root'
 })
 export class UbigeoService {

   private baseUrl = 'http://localhost:9000/ubigeo';

   constructor(private http: HttpClient) { }

   private getHeaders(): HttpHeaders {
     const token = localStorage.getItem('token'); // O donde estés guardando el token
     return new HttpHeaders({
       'Authorization': `Bearer ${token}`
     });
   }

   listarDepartamentos(): Observable<string[]> {
     return this.http.get<string[]>(`${this.baseUrl}/departamentos`, { headers: this.getHeaders() });
   }

   listarProvincias(departamento: string): Observable<string[]> {
     return this.http.get<string[]>(`${this.baseUrl}/provincias/${departamento}`, { headers: this.getHeaders() });
   }

   listarDistritos(departamento: string, provincia: string): Observable<any[]> {
     return this.http.get<any[]>(`${this.baseUrl}/distritos/${departamento}/${provincia}`, { headers: this.getHeaders() });
   }
 }