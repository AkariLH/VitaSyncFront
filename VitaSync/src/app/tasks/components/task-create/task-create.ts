import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-task-modal',
  templateUrl: './task-create.html',
  styleUrls: ['./task-create.css'],
  standalone: true,
  imports: [CommonModule,FormsModule]
})
export class TaskCreate {
  @Output() onClose = new EventEmitter<void>();
  @Output() onCreate = new EventEmitter<any>();

  categorias = ['Hogar', 'Trabajo', 'Salud', 'Personal', 'Estudio'];

  task = {
    titulo: '',
    descripcion: '',
    categoria: '',
    entrega: '',
    inicio: '',
    prioridad: 'Media',
    dificultad: 'Media',
    estado: 'Pendiente',
    subtareas: [] as string[]
  };

  nuevaSubtarea = '';

  addSubtarea() {
    if (this.nuevaSubtarea.trim()) {
      this.task.subtareas.push(this.nuevaSubtarea.trim());
      this.nuevaSubtarea = '';
    }
  }

  createTask() {
    this.onCreate.emit(this.task);
    this.closeModal();
  }

  closeModal() {
    this.onClose.emit();
  }
}
