import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Habit {
  private apiUrl = 'http://localhost:8989/api/habitos'

  constructor(private http: HttpClient) { }

  getHabitos(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  crearHabito(habito: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, habito);
  }
}
