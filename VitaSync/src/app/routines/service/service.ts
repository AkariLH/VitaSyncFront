import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Subrutina {
  id: number;
  name: string;
  routine: number;
}

export interface Routine {
  id: number;
  nombreRutina: string;
  descripcionRutina: string;
  horaInicioRutina: string;
  duracionRutinaMinutos: number;
  repeticion: string;
  activa: boolean;
  usuario: number;
  subrutinas?: Subrutina[];
}

@Injectable({ providedIn: 'root' })
export class RoutineService {
  private apiUrl = 'http://localhost:8989/api/rutinas';

  constructor(private http: HttpClient) {}

  getRoutinesByUser(usuarioId: number): Observable<Routine[]> {
    return this.http.get<Routine[]>(`${this.apiUrl}?usuarioId=${usuarioId}`);
  }

  getSubrutinasByRoutine(routineId: number): Observable<Subrutina[]> {
    return this.http.get<Subrutina[]>(`${this.apiUrl}/${routineId}/subrutinas`);
  }

  createRoutine(routine: Partial<Routine>): Observable<Routine> {
    return this.http.post<Routine>(this.apiUrl, routine);
  }

  // Otros métodos: update, delete, etc.
}
