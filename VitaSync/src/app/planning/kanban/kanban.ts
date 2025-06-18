import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DragDropModule, CdkDragDrop } from '@angular/cdk/drag-drop';
import { Router } from '@angular/router';

import { TaskService, Task } from '../../tasks/services/task';
import { CategoryService, Categoria } from '../../tasks/services/category';

interface TaskWithCategoria extends Task {
  categoriaObj?: Categoria;
}

@Component({
  selector: 'app-kanban',
  standalone: true,
  imports: [CommonModule, FormsModule, DragDropModule],
  templateUrl: './kanban.html',
  styleUrl: './kanban.css',
})
export class Kanban implements OnInit {
  tareas: TaskWithCategoria[] = [];
  categorias: Categoria[] = [];

  filtroCategoria: number | null = null;
  filtroPrioridad: string = '';
  filtroFecha: string = '';

  filtroFechaDesde: string = '';
  filtroFechaHasta: string = '';

  user = JSON.parse(localStorage.getItem('user') || '{}');
  usuarioId = this.user.id || 0;

  @Input() reload: boolean = false;

  constructor(
    private taskService: TaskService,
    private categoryService: CategoryService,
    private router: Router
  ) {
    console.log('Usuario cargado:', this.user); // <-- Agrega esto para depurar
  }

  ngOnInit(): void {
    if (!this.usuarioId) {
      this.router.navigate(['/login']);
      return;
    }
    this.categoryService.getAll().subscribe({
      next: (cats) => {
        this.categorias = cats;
        this.cargarTareas();
      },
      error: (err) => console.error('Error al cargar categorías:', err),
    });
  }

  ngOnChanges(changes: SimpleChanges) {
  if (changes['reload'] && !changes['reload'].firstChange) {
    this.cargarTareas(); // O el método que recarga tus datos
  }
}

  cargarTareas(): void {
    this.taskService.getAll(this.usuarioId).subscribe({
      next: (tareas) => {
        console.log('Tareas recibidas:', tareas); // <-- Agrega esto
        this.tareas = tareas.map(t => ({
          ...t,
          categoriaObj: this.categorias.find(c => c.id === t.categoria),
          estado: this.mapEstadoToFrontend(t.estado), // <-- Usa función para mapear
        }));
      },
      error: (err) => console.error('Error al cargar tareas:', err),
    });
  }

  tareasPorEstado(estado: string): TaskWithCategoria[] {
    return this.tareas.filter(t => {
      const coincideEstado = t.estado.toLowerCase() === estado;
      const coincideCategoria = !this.filtroCategoria || t.categoria === this.filtroCategoria;
      const coincidePrioridad = !this.filtroPrioridad || t.prioridad === this.filtroPrioridad;

      // Filtro por fecha exacta (opcional, puedes quitarlo si solo quieres rango)
      const coincideFecha =
        !this.filtroFecha ||
        (this.filtroFecha === 'hoy' &&
          t.fechaEntregaTarea?.startsWith(new Date().toISOString().split('T')[0]));

      // Filtro por rango de fechas
      let coincideRango = true;
      if (this.filtroFechaDesde) {
        coincideRango = coincideRango && !!t.fechaEntregaTarea && t.fechaEntregaTarea >= this.filtroFechaDesde;
      }
      if (this.filtroFechaHasta) {
        coincideRango = coincideRango && !!t.fechaEntregaTarea && t.fechaEntregaTarea <= this.filtroFechaHasta;
      }

      return coincideEstado && coincideCategoria && coincidePrioridad && coincideFecha && coincideRango;
    });
  }

  onFiltroChange(): void {
    // solo fuerza el filtro ya que tareasPorEstado lo hace dinámicamente
  }

  limpiarFiltros(): void {
    this.filtroCategoria = null;
    this.filtroPrioridad = '';
    this.filtroFecha = '';
    this.filtroFechaDesde = '';
    this.filtroFechaHasta = '';
  }

  onDrop(event: CdkDragDrop<TaskWithCategoria[]>, nuevoEstado: string): void {
    console.log('onDrop llamado:', event, nuevoEstado);
    const tarea = event.item.data;
    console.log('Tarea a actualizar:', tarea);

    if (!tarea?.id || !nuevoEstado) return;

    const estadoBackend = this.mapEstadoToBackend(nuevoEstado);
    const tareaActualizada: Task = {
      ...tarea,
      estado: estadoBackend,
      fechaActualizacion: new Date().toISOString(),
      usuarioId: this.usuarioId,
    };

    console.log('Enviando actualización:', tareaActualizada);

    this.taskService.update(tarea.id, tareaActualizada).subscribe({
      next: (res) => {
        console.log('Respuesta del backend:', res);
        tarea.estado = nuevoEstado;
      },
      error: (err) => console.error('Error al actualizar estado:', err),
    });
  }

  private mapEstadoToBackend(estado: string): string {
    const map: { [key: string]: string } = {
      'pendiente': 'Pendiente',
      'en progreso': 'En_progreso',
      'completado': 'Hecho',
      'cancelado': 'Cancelado',
    };
    return map[estado] || estado;
  }

  private mapEstadoToFrontend(estado: string): string {
    const map: { [key: string]: string } = {
      'Pendiente': 'pendiente',
      'En_progreso': 'en progreso',
      'Hecho': 'completado',
      'Cancelado': 'cancelado',
    };
    return map[estado] || estado.replace('_', ' ').toLowerCase();
  }
}
