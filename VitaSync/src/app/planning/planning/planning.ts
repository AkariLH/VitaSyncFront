import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Sidebar } from '../../sidebar/sidebar';
import { Kanban } from '../kanban/kanban';
import { Gantt } from '../gantt/gantt';
import { Calendar } from '../calendar/calendar';

@Component({
  selector: 'app-planning',
  imports: [CommonModule, Sidebar,Kanban,Gantt,Calendar],
  templateUrl: './planning.html',
  styleUrl: './planning.css'
})
export class Planning{
  sidebarOpen = true;
  vista: 'kanban' | 'gantt' | 'calendario' = 'kanban';

  abrirModalTarea() {
    // lógica para modal de tarea
  }

  abrirModalEvento() {
    // lógica para modal de evento
  }

  closeSidebar() {
    this.sidebarOpen = false;
  }
}