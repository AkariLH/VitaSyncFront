import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Sidebar } from '../sidebar/sidebar';

@Component({
  selector: 'app-finance',
  imports: [CommonModule,Sidebar],
  templateUrl: './finance.html',
  styleUrl: './finance.css'
})
export class Finance {
  sidebarOpen = true;

  transacciones = [
  { fecha: '1/7/2024', tipo: 'Ingreso', categoria: 'Salario', monto: 2500 },
  { fecha: '3/7/2024', tipo: 'Gasto', categoria: 'Compras', monto: 50 },
  { fecha: '5/7/2024', tipo: 'Gasto', categoria: 'Transporte', monto: 20 },
  { fecha: '10/7/2024', tipo: 'Ingreso', categoria: 'Freelance', monto: 300 },
  { fecha: '12/7/2024', tipo: 'Transferencia', categoria: 'Transferencia Interna', monto: 100 },
  { fecha: '15/7/2024', tipo: 'Gasto', categoria: 'Ocio', monto: 75 }
];

objetivos = [
  { id: 'g1', nombre: 'Fondo de Vacaciones', meta: 1000, actual: 350, limite: '26/10/2024' },
  { id: 'g2', nombre: 'Portátil Nuevo', meta: 1500, actual: 700, limite: '01/12/2024' }
];

  closeSidebar() {
    this.sidebarOpen = false;
  }

  registrarTransaccion() {}
  crearObjetivo() {}
}