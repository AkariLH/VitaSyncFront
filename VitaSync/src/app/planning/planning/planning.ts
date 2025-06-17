import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Sidebar } from '../../sidebar/sidebar';
import { Kanban } from '../kanban/kanban';
import { Gantt } from '../gantt/gantt';
import { Calendar } from '../calendar/calendar';
import { TaskCreate } from '../../tasks/components/task-create/task-create';

@Component({
  selector: 'app-planning',
  imports: [CommonModule, Sidebar,Kanban,Gantt,Calendar, TaskCreate],
  templateUrl: './planning.html',
  styleUrl: './planning.css'
})
export class Planning{
  sidebarOpen = true;
  vista: 'kanban' | 'gantt' | 'calendario' = 'kanban';

  showCreateTaskModal = false;

  abrirModalTarea() {
    this.showCreateTaskModal = true;
  }

  cerrarModalTarea() {
    this.showCreateTaskModal = false;
  }

  abrirModalEvento() {
    // lógica para modal de evento
  }

  closeSidebar() {
    this.sidebarOpen = false;
  }
}