import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Categoria {
  id?: number;
  nombreCategoria: string;
  colorCategoria: string;
}

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private apiUrl = 'http://localhost:8989/api/categorias'; // Cambia el puerto si es necesario

  constructor(private http: HttpClient) {}

  getAll(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(this.apiUrl);
  }

  create(categoria: Categoria): Observable<Categoria> {
    return this.http.post<Categoria>(this.apiUrl, categoria);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  update(categoria: Categoria): Observable<Categoria> {
    if (!categoria.id) throw new Error('La categoría debe tener un id para actualizarse');
    return this.http.put<Categoria>(`${this.apiUrl}/${categoria.id}`, categoria);
  }
}
