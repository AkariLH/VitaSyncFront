import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TaskCreate } from '../components/task-create/task-create';
import { CategoryModal } from '../components/category-modal/category-modal';

@Component({
  selector: 'app-task-dashboard',
  templateUrl: './tasks.html',
  styleUrls: ['./tasks.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, TaskCreate,CategoryModal]
})
export class Tasks {
  modalVisible = false;
  categoryModalVisible = false;
  showCreateTaskModal = false;
  tasks = [
    {
      titulo: 'Compra de Supermercado',
      descripcion: 'Comprar leche, huevos, pan, frutas y verduras.',
      categoria: 'Hogar',
      estado: 'Pendiente',
      prioridad: 'Media',
      dificultad: 'Fácil',
      entrega: '30/07/24, 18:00',
      creacion: '21/05/2024, 10:30',
    },
    {
      titulo: 'Informe de Proyecto Trimestral',
      descripcion: 'Finalizar y enviar el informe del proyecto Q3.',
      categoria: 'Trabajo',
      estado: 'En Progreso',
      prioridad: 'Alta',
      dificultad: 'Media',
      entrega: '02/08/24, 17:00',
      creacion: '18/05/2024, 14:00',
    },
    {
      titulo: 'Sesión de Gimnasio',
      descripcion: 'Entrenamiento de fuerza completo.',
      categoria: 'Salud',
      estado: 'Completado',
      prioridad: 'Media',
      dificultad: 'Fácil',
      entrega: '28/07/24, 19:00',
      creacion: '26/07/2024, 08:00',
    },
  ];
    
  openModal() {
    this.modalVisible = true;
  }

  closeModal() {
    this.modalVisible = false;
  }

  onTaskCreated(task: any) {
    console.log('Tarea creada:', task);
    this.tasks.push(task); // o manejar la tarea como necesites
    this.closeModal();
  }

  openCategoryModal() {
    this.categoryModalVisible = true;
  }

  closeCategoryModal() {
    this.categoryModalVisible = false;
  }

  updateCategories(categories: any[]) {
    console.log('Categorías actualizadas:', categories);
    // Aquí puedes manejar la actualización de categorías como necesites
    this.closeCategoryModal();
  }
}
