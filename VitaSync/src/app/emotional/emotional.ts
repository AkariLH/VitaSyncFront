import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Sidebar } from '../sidebar/sidebar';

@Component({
  selector: 'app-emotional',
  standalone: true,
  imports: [CommonModule,Sidebar],
  templateUrl: './emotional.html',
  styleUrl: './emotional.css'
})
export class Emotional {
  sidebarOpen = true;

  emociones = [
    {
      fecha: '15 jun 2025',
      hora: '10:00',
      emocion: 'Feliz',
      tipo: 'POSITIVA',
      intensidad: 4,
      color: '#4CAF50'
    },
    {
      fecha: '14 jun 2025',
      hora: '20:00',
      emocion: 'Triste',
      tipo: 'NEGATIVA',
      intensidad: 3,
      color: '#E53935'
    }
  ];

  closeSidebar() {
    this.sidebarOpen = false;
  }

  registrarEmocion() {
    // abrir modal de registro emocional
  }
}
