import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Sidebar } from '../../sidebar/sidebar';
import { CreateHabit } from '../create-habit/create-habit';
import { Habit } from '../habit/habit';

@Component({
  selector: 'app-habits',
  imports: [CommonModule,Sidebar, CreateHabit],
  templateUrl: './habits.html',
  styleUrl: './habits.css'
})
export class Habits {

   sidebarOpen = true;
   showCreateModal = false;
   habitos: any[] = []; 
   usuarioId: number=0; // <-- Asegúrate de inicializarlo correctamente

   constructor(private habitService: Habit){}

  ngOnInit() {
    const user = localStorage.getItem('user');
    this.usuarioId = user ? JSON.parse(user).id : 0;
    console.log('usuarioId en Habits:', this.usuarioId);
    this.cargarHabitos();
  }

  cargarHabitos() {
    this.habitService.getHabitos().subscribe({
      next: (data) => this.habitos = data,
      error: () => this.habitos = []
    });
  }

  closeSidebar() {
    this.sidebarOpen = false;
  }

  crearHabito() {
    this.showCreateModal = true; // <-- Abre el modal
  }

  onHabitCreated(habito: any) {
    this.cargarHabitos();
    this.showCreateModal = false;
  }

  closeCreateModal() {
    this.showCreateModal = false;
  }

  eliminarHabito(_t20: any) {
    throw new Error('Method not implemented.');
  }
  editarHabito(_t20: any) {
    throw new Error('Method not implemented.');
  }
  marcarHechoHoy(_t20: any) {
    throw new Error('Method not implemented.');
  }
}