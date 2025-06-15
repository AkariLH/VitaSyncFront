import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Sidebar } from '../sidebar/sidebar';

@Component({
  selector: 'app-habits',
  imports: [CommonModule,Sidebar],
  templateUrl: './habits.html',
  styleUrl: './habits.css'
})
export class Habits {
   sidebarOpen = true;

  habitos = [
    {
      nombre: 'Beber agua',
      descripcion: 'Tomar 8 vasos de agua al día',
      frecuencia: 'DIARIA',
      progreso: 6,
      objetivo: 8
    },
    {
      nombre: 'Leer',
      descripcion: 'Leer al menos 15 minutos',
      frecuencia: 'SEMANAL',
      progreso: 3,
      objetivo: 5
    }
  ];

  closeSidebar() {
    this.sidebarOpen = false;
  }

  crearHabito() {
    // abrir modal o navegar a formulario
  }
}
