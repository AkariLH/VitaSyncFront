import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Sidebar } from '../sidebar/sidebar';

@Component({
  selector: 'app-chores',
  standalone: true,
  imports: [CommonModule,Sidebar],
  templateUrl: './chores.html',
  styleUrl: './chores.css'
})
export class Chores {
  inactiveQuehaceres: any[] = [];
  activeQuehaceres: any[] = [];
  sidebarOpen = true;

  quehaceres = [
    {
      nombre: 'Lavar Platos',
      descripcion: 'Después de cada comida principal.',
      frecuencia: 'Diaria',
      dias: ['L', 'M', 'X', 'J', 'V', 'S', 'D'],
      activo: true,
      hechoHoy: true
    },
    {
      nombre: 'Sacar la Basura',
      descripcion: 'Martes y Viernes por la noche.',
      frecuencia: 'Semanal',
      dias: ['Ma', 'Vi'],
      activo: true,
      hechoHoy: false
    },
    {
      nombre: 'Ordenar Despensa',
      descripcion: 'Revisar fechas de caducidad.',
      frecuencia: 'Mensual',
      dias: [],
      activo: false,
      hechoHoy: false
    }
  ];

  marcarHecho(q: any) {
    q.hechoHoy = true;
  }


  closeSidebar() {
    this.sidebarOpen = false;
  }

  agregarQuehacer() {
    // Lógica de modal o formulario
  }
}
