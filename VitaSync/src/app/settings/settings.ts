import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Sidebar } from '../sidebar/sidebar';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-settings',
  imports: [CommonModule,Sidebar, FormsModule],
  templateUrl: './settings.html',
  styleUrl: './settings.css'
})
export class Settings {
  sidebarOpen = true;

  usuario = {
    nombre: 'Juan Pérez',
    correo: 'juanperez@example.com',
    tema: 'claro'
  };

  closeSidebar() {
    this.sidebarOpen = false;
  }

  actualizarDatos() {
    // lógica de envío
  }

  cambiarTema(valor: string) {
    this.usuario.tema = valor;
  }

}
