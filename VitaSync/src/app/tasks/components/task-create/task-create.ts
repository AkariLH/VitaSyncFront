import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CategoryService, Categoria } from '../../services/category'; // Asegúrate de que la ruta sea correcta
import { TaskService, Task } from '../../services/task';

@Component({
  selector: 'app-task-modal',
  templateUrl: './task-create.html',
  styleUrls: ['./task-create.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class TaskCreate implements OnInit {
  @Output() onClose = new EventEmitter<void>();
  @Output() onCreate = new EventEmitter<any>();

  // Recibe el id del usuario activo desde el componente padre
  @Input() usuarioId!: number;

  // Recibe las tareas y categorías desde el componente padre
  @Input() tareas: any[] = [];

  categorias: any[] = []; // Para almacenar las categorías recibidas
  constructor(
    private http: HttpClient,
    private categoryService: CategoryService,
    private taskService: TaskService
  ) {}

  ngOnInit() {
    this.categoryService.getAll().subscribe(cats => this.categorias = cats);
  }

  task: {
    nombreTarea: string;
    descripcionTarea: string;
    fechaCreacionTarea: string;
    fechaEntregaTarea: string;
    fechaInicioTarea: string | null;
    fechaFinTarea: string | null;
    fechaActualizacion: string;
    prioridad: string;
    dificultado: string;
    estado: string;
    usuarioId: number | 0; // Se asigna al crear
    dependencia: any;
    subtareaDe: any;
    categoria: any;
  } = {
    nombreTarea: '',
    descripcionTarea: '',
    fechaCreacionTarea: '', // Se asigna al crear
    fechaEntregaTarea: '',  // Opcional, del formulario
    fechaInicioTarea: '',   // Opcional, del formulario
    fechaFinTarea: null,    // No se envía al crear
    fechaActualizacion: '', // Se asigna al crear
    prioridad: 'media',
    dificultado: 'media',
    estado: 'Pendiente',
    usuarioId: 0,        // Se asigna al crear
    dependencia: null,      // Select de tareas
    subtareaDe: null,       // Siempre null
    categoria: null         // Select de categorías
  };
  
  createTask() {
    const nowIso = new Date().toISOString();
    this.task.fechaCreacionTarea = nowIso;
    this.task.fechaActualizacion = nowIso;
    this.task.usuarioId = this.usuarioId;
    this.task.subtareaDe = null;
    this.task.fechaFinTarea = null;
    this.task.usuarioId = this.usuarioId;
    if (!this.task.fechaInicioTarea) {
      this.task.fechaInicioTarea = null;
    }

    console.log(this.task);
    this.taskService.create(this.task).subscribe({
      next: (res) => {
        this.onCreate.emit(res);
        this.closeModal();
      },
      error: () => {
        alert('Error al crear la tarea');
      }
    });
  }

  closeModal() {
    this.onClose.emit();
  }
}
