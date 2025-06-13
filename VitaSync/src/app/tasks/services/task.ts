import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Task {
  id?: number;
  nombreTarea: string;
  descripcionTarea: string;
  fechaCreacionTarea?: string; // Se asigna al crear
  fechaEntregaTarea?: string; // Opcional, del formulario
  fechaInicioTarea?: string | null; // Opcional, del formulario
  fechaFinTarea?: string  | null; // No se envía al crear
  fechaActualizacion?: string;
  prioridad: string;
  dificultado: string;
  estado: string;
  usuarioId: number | 0; // Se asigna al crear
  dependencia?: number;
  subtareaDe?: number;
  categoria?: number;
}

@Injectable({ providedIn: 'root' })
export class TaskService {
  private apiUrl = 'http://localhost:8989/api/tareas';

  constructor(private http: HttpClient) {}

  getAll(usuarioId: number): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.apiUrl}?usuarioId=${usuarioId}`);
  }

  create(task: Task): Observable<Task> {
    return this.http.post<Task>(this.apiUrl, task);
  }

  update(id: number, task: Task): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}/${id}`, task);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}