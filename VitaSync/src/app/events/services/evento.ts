import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Evento {
  private apiUrl = 'http://localhost:8989/api/eventos'; 
  constructor(private http: HttpClient) { }

  createEvento(evento: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, evento);
  }

  getCategorias(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/categoria`);
  }

  createCategoria(categoria: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/categoria`, categoria);
  }

  getRepeticiones(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/repeticion`);
  }

  createRepeticion(repeticion: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/repeticion`, repeticion);
  }
}
