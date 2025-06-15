import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Sidebar } from '../sidebar/sidebar';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-shopping-list',
  imports: [CommonModule,Sidebar,FormsModule],
  templateUrl: './shopping-list.html',
  styleUrl: './shopping-list.css'
})
export class ShoppingList {
  sidebarOpen = true;

  listas = [
  {
    nombre: 'Supermercado Semanal',
    descripcion: 'Compras para la semana.',
    completados: 1,
    items: [
      { nombre: 'Leche (2L)', completado: false, prioridad: 'media' },
      { nombre: 'Pan integral (1 paquete)', completado: true, prioridad: 'alta' },
      { nombre: 'Manzanas (1kg)', completado: false, prioridad: 'media' },
      { nombre: 'Pollo (500g)', completado: false, prioridad: 'alta' }
    ]
  },
  {
    nombre: 'Ferretería Proyecto Jardín',
    descripcion: 'Progreso de Artículos',
    completados: 2,
    items: [
      { nombre: 'Tornillos para madera (1 caja)', completado: true, prioridad: 'alta' },
      { nombre: 'Pintura blanca exterior (1L)', completado: true, prioridad: 'media' },
      { nombre: 'Guantes de jardinería (1 par)', completado: false, prioridad: 'baja' }
    ]
  }
];

  toggle(item: any) {
    item.completado = !item.completado;
  }

  agregarCompra() {
    // Abrir modal o lógica de formulario
  }

  closeSidebar() {
    this.sidebarOpen = false;
  }
}