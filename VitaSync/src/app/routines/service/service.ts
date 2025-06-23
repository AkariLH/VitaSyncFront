import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Subrutina {
  id: number;
  nombrePaso: string;
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

export interface RegistroRutina {
  id: number;
  rutina: number | {id: number}
  fecha: string;
  horaInicio: string;
  pasosCompletados: number;
}

@Injectable({ providedIn: 'root' })
export class RoutineService {
  private apiUrl = 'http://localhost:8989/api/rutinas';

  constructor(private http: HttpClient) {}

  getRoutinesByUser(usuarioId: number): Observable<Routine[]> {
    return this.http.get<Routine[]>(`${this.apiUrl}?usuarioId=${usuarioId}`);
  }

  getSubrutinasByRoutine(rutinaId: number): Observable<Subrutina[]> {
    return this.http.get<Subrutina[]>(`http://localhost:8989/api/rutinas/pasos/rutina/${rutinaId}`);
  }

  createRoutine(routine: Partial<Routine>): Observable<Routine> {
    return this.http.post<Routine>(this.apiUrl, routine);
  }

  getRegistrosByUser(usuarioId: number): Observable<RegistroRutina[]> {
    return this.http.get<RegistroRutina[]>(`http://localhost:8989/api/rutinas/registro-rutina/usuario/${usuarioId}`);
  }

  createRegistroRutina(registro: Partial<RegistroRutina>): Observable<RegistroRutina> {
  return this.http.post<RegistroRutina>('http://localhost:8989/api/rutinas/registro-rutina', registro);
  }

  updateRegistroRutina(id: number, registro: Partial<RegistroRutina>): Observable<RegistroRutina> {
    return this.http.put<RegistroRutina>(`http://localhost:8989/api/rutinas/registro-rutina/${id}`, registro);
  }

  createPasos(rutinaId: number, pasos: string[]): Promise<any[]> {
  const pasoRequests = pasos.map((nombrePaso, idx) =>
    this.http.post('http://localhost:8989/api/rutinas/pasos', {
      nombrePaso,
      ordenPaso: idx + 1,
      rutina: { id: rutinaId }
    }).toPromise()
  );
  return Promise.all(pasoRequests);
}

  

  // Otros métodos: update, delete, etc.
}
