// src/app/core/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface RegisterPayload {
  nombreUsuario: string;
  apellidoUsuario: string;
  correoElectronico: string;
  claveAcceso: string;
}

export interface LoginPayload {
  correoElectronico: string;
  claveAcceso: string;
}

export interface User {
  id: number;
  nombreUsuario: string;
  apellidoUsuario: string;
  correoElectronico: string;
  claveAcceso: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:8989/api/users';

  constructor(private http: HttpClient) {}

  register(payload: RegisterPayload): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/register`, payload);
  }

  login(payload: LoginPayload): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/login`, payload);
  }

  getProfile(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  updateProfile(id: number, data: RegisterPayload): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${id}`, data);
  }
}
