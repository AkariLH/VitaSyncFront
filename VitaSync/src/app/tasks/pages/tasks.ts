import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TaskCreate } from '../components/task-create/task-create';
import { CategoryModal } from '../components/category-modal/category-modal';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Task } from '../services/task';
import { TaskService } from '../services/task';
import { OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Sidebar } from '../../sidebar/sidebar';
import { CategoryService, Categoria } from '../services/category';

interface TaskWithCategoria extends Task {
  categoriaObj?: Categoria;
}

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
  tasks: TaskWithCategoria[] = [];
  categorias: any[] = [];
  user = JSON.parse(localStorage.getItem('user') || '{}');
  usuarioId = this.user.id || 0;
  filtroCategoria: number | null = null; // Para filtrar por categoría
  filtroEstado: string | null = null; // Para filtrar por estado
  filtroPrioridad: string | null = null; // Para filtrar por prioridad
  filtroBusqueda: string = ''; // Para filtrar por nombre de tarea
  filteredTasks: TaskWithCategoria[] = [];
  tareaEditando: TaskWithCategoria | null = null;
  showEditTaskModal: boolean = false;

  constructor(private TaskService: TaskService, private router: Router, private http: HttpClient, private categoryService: CategoryService) {}

  ngOnInit() {
    this.loadTasks();
    this.categoryService.getAll().subscribe(cats => {
      this.categorias = cats;
      this.loadTasks();
    });
  // Borrar el siguiente código si no es necesario solo es para verificar sesión
    const user = localStorage.getItem('user');
      if (user) {
        console.log('Sesión activa:', JSON.parse(user));
      } else {
        console.log('No hay sesión, redirigiendo...');
        this.router.navigate(['/login']);
      }
  }

  loadTasks(): void {
    this.TaskService.getAll(this.usuarioId).subscribe({
      next: (tasks) => {
        this.tasks = tasks.map(task => ({
          ...task,
          categoriaObj: this.categorias.find(cat => cat.id === task.categoria)
        }));
        this.aplicarFiltros();
      },
      error: () => alert('Error al cargar las tareas.')
    });
  }

  aplicarFiltros(): void {
    this.filteredTasks = this.tasks.filter(task => {
      const coincideCategoria = !this.filtroCategoria || task.categoria === this.filtroCategoria;
      const coincideEstado = !this.filtroEstado || task.estado === this.filtroEstado;
      const coincidePrioridad = !this.filtroPrioridad || task.prioridad === this.filtroPrioridad;
      const coincideBusqueda =
        !this.filtroBusqueda ||
        (task.nombreTarea?.toLowerCase().includes(this.filtroBusqueda.toLowerCase()) ||
         task.descripcionTarea?.toLowerCase().includes(this.filtroBusqueda.toLowerCase()));
      return coincideCategoria && coincideEstado && coincidePrioridad && coincideBusqueda;
    });
  }

  limpiarFiltros(): void {
    this.filtroCategoria = null;
    this.filtroEstado = null;
    this.filtroPrioridad = null;
    this.filtroBusqueda = '';
    this.aplicarFiltros();
  }

  onTaskCreated(task: any) {
    this.loadTasks(); // Recargar tareas después de crear una nueva
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

  abrirModalEditar(task: TaskWithCategoria) {
    this.tareaEditando = { ...task };
    this.showEditTaskModal = true;
  }

  cerrarModalEditar() {
    this.tareaEditando = null;
    this.showEditTaskModal = false;
  }

 onTaskEdited(tarea: Task) {
    if (!tarea || !tarea.id) {
      console.error('Tarea inválida al editar:', tarea);
      return;
    }

    // Actualiza la tarea en el array y recalcula categoriaObj
    const index = this.tasks.findIndex(t => t.id === tarea.id);
    if (index !== -1) {
      this.tasks[index] = {
        ...tarea,
        categoriaObj: this.categorias.find(cat => cat.id === tarea.categoria)
      };
    }
    this.aplicarFiltros();
    this.cerrarModalEditar();
  }


  abrirModalNuevaTarea() {
    this.showCreateTaskModal = true;
  }

  cerrarModalNuevaTarea() {
    this.showCreateTaskModal = false;
  }

  eliminarTarea(task: TaskWithCategoria) {
    if (confirm('¿Seguro que deseas eliminar esta tarea?')) {
      this.TaskService.delete(task.id!).subscribe({
        next: () => {
          this.tasks = this.tasks.filter(t => t.id !== task.id);
          this.aplicarFiltros();
        },
        error: () => alert('Error al eliminar la tarea.')
      });
    }
  }

  actualizarEstadoTarea(task: TaskWithCategoria) {
    this.TaskService.update(task.id!, { ...task, estado: task.estado }).subscribe({
      next: (updatedTask) => {
        // Opcional: Actualiza la UI si es necesario
      },
      error: () => alert('Error al actualizar el estado de la tarea.')
    });
  }
  
}
