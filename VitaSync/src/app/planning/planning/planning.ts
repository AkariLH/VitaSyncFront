import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Sidebar } from '../../sidebar/sidebar';
import { Kanban } from '../kanban/kanban';
import { Gantt } from '../gantt/gantt';
import { Calendar } from '../calendar/calendar';
import { TaskCreate } from '../../tasks/components/task-create/task-create';
import { TaskService } from '../../tasks/services/task';
import { EventCreate } from '../../events/event-create/event-create';

@Component({
  selector: 'app-planning',
  imports: [CommonModule, Sidebar,Kanban,Gantt,Calendar, TaskCreate, EventCreate],
  templateUrl: './planning.html',
  styleUrl: './planning.css'
})
export class Planning {
  sidebarOpen = true;
  vista: 'kanban' | 'gantt' | 'calendario' = 'kanban';
  showCreateTaskModal = false;
  showCreateEventModal: boolean = false;
  modalVisible = false;
  tasks: any[] = [];
  categorias: any[] = [];
  user: any = null; 
  usuarioId: any = null; 
  reloadFlag = false;

  constructor(private TaskService: TaskService) {
    const userStr = localStorage.getItem('user');
    this.user = userStr ? JSON.parse(userStr) : null;
    this.usuarioId = this.user ? this.user.id : null; 
  }

  abrirModalTarea() {
    this.showCreateTaskModal = true;
  }

  cerrarModalTarea() {
    this.showCreateTaskModal = false;
  }

  abrirModalEvento() {
    this.showCreateEventModal = true;
  }

  cerrarModalEvento() {
    this.showCreateEventModal = false;
  }

  closeSidebar() {
    this.sidebarOpen = false;
  }

  onTaskCreated(task: any) {
    this.reloadFlag = !this.reloadFlag; // Cambia el valor para forzar recarga
    this.cerrarModalTarea();
  }

    loadTasks(): void {
    this.TaskService.getAll(this.usuarioId).subscribe({
      next: (tasks) => {
        this.tasks = tasks.map(task => ({
          ...task,
          categoriaObj: this.categorias.find(cat => cat.id === task.categoria)
        }));
      },
      error: () => alert('Error al cargar las tareas.')
    });
  }

  onEventCreated(event: any) {
    this.showCreateEventModal = false;
    this.reloadFlag = !this.reloadFlag;
  }
}