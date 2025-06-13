import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TaskCreate } from '../components/task-create/task-create';
import { CategoryModal } from '../components/category-modal/category-modal';
import { HttpClientModule } from '@angular/common/http';
import { Task } from '../services/task';
import { TaskService } from '../services/task';
import { OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Sidebar } from '../../sidebar/sidebar';

@Component({
  selector: 'app-task-dashboard',
  templateUrl: './tasks.html',
  styleUrls: ['./tasks.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, TaskCreate,CategoryModal, HttpClientModule, Sidebar]
})
export class Tasks implements OnInit {
  sidebarOpen  = true;
  modalVisible = false;
  categoryModalVisible = false;
  showCreateTaskModal = false;
  tasks: any[] = [];
  user = JSON.parse(localStorage.getItem('user') || '{}');
  usuarioId = this.user.id || 0;
  constructor(private TaskService: TaskService, private router: Router) {}


  ngOnInit() {
  this.loadTasks();
  // Borrar el siguiente código si no es necesario solo es para verificar sesión
  const user = localStorage.getItem('user');
    if (user) {
      console.log('Sesión activa:', JSON.parse(user));
    } else {
      console.log('No hay sesión, redirigiendo...');
      this.router.navigate(['/login']);
    }
  }

  loadTasks() {
    this.TaskService.getAll(this.usuarioId).subscribe(tasks => {
      this.tasks = Array.isArray(tasks) ? tasks : [];
    });
  }

  onTaskCreated(task: any) {
    this.tasks.push(task);
    this.modalVisible = false;
  }

  openModal() {
    this.modalVisible = true;
  }

  closeModal() {
    this.modalVisible = false;
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
