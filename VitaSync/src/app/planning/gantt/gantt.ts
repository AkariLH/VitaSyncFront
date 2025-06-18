import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskService, Task } from '../../tasks/services/task';
import { CategoryService, Categoria } from '../../tasks/services/category';

interface TaskWithCategoria extends Task {
  categoriaObj?: Categoria;
}

@Component({
  selector: 'app-gantt',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './gantt.html',
  styleUrl: './gantt.css'
})

export class Gantt implements OnInit {
  tareas: TaskWithCategoria[] = [];
  categorias: Categoria[] = [];
  filtroCategoria: string = '';
  usuarioId: number = 0;
  windowStart: number = 0;
  windowSize: number = 14;

  constructor(
    private taskService: TaskService,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.usuarioId = user?.id || 0;

    this.categoryService.getAll().subscribe({
      next: (categorias) => {
        this.categorias = categorias;
        this.cargarTareas();
        this.setSemanaActual(); // Siempre inicia desde el día actual
      },
      error: (err) => console.error('Error al cargar categorías:', err)
    });
  }

  cargarTareas(): void {
    this.taskService.getAll(this.usuarioId).subscribe({
      next: (tareas) => {
        this.tareas = tareas.map(t => ({
          ...t,
          categoriaObj: this.categorias.find(c => c.id === t.categoria)
        }));
      },
      error: (err) => console.error('Error al cargar tareas:', err)
    });
  }

  tareasFiltradas(): TaskWithCategoria[] {
    if (!this.filtroCategoria) {
      return this.tareas;
    }
    return this.tareas.filter(t => t.categoriaObj?.id === Number(this.filtroCategoria));
  }

  generarFechas(): Date[] {
    const fechas: Date[] = [];
    const inicio = new Date();
    inicio.setDate(inicio.getDate() - 30); // para ver margen antes del presente
    inicio.setHours(0, 0, 0, 0);

    for (let i = 0; i < 180; i++) {
      const fecha = new Date(inicio);
      fecha.setDate(inicio.getDate() + i);
      fechas.push(new Date(fecha));
    }
    return fechas;
  }

  get fechasVentana(): Date[] {
    const fechas = this.generarFechas();
    return fechas.slice(this.windowStart, this.windowStart + this.windowSize);
  }

  moverVentana(dir: number) {
    const total = this.generarFechas().length;
    const nuevoInicio = this.windowStart + dir * this.windowSize;
    if (nuevoInicio >= 0 && nuevoInicio + this.windowSize <= total) {
      this.windowStart = nuevoInicio;
    }
  }

  calcularOffset(tarea: TaskWithCategoria): number {
    const inicioTarea = new Date(tarea.fechaCreacionTarea as string);
    const inicioVentana = this.fechasVentana[0];
    inicioTarea.setHours(0,0,0,0);
    inicioVentana.setHours(0,0,0,0);
    return Math.max(0, Math.floor((inicioTarea.getTime() - inicioVentana.getTime()) / (1000 * 60 * 60 * 24)));
  }

  calcularAnchura(tarea: TaskWithCategoria): number {
    const rawInicio = new Date(tarea.fechaCreacionTarea as string);
    const rawFin = new Date(tarea.fechaEntregaTarea as string);
    const ventanaInicio = new Date(this.fechasVentana[0]);
    const ventanaFin = new Date(this.fechasVentana[this.fechasVentana.length - 1]);

    rawInicio.setHours(0, 0, 0, 0);
    rawFin.setHours(23, 59, 59, 999);
    ventanaInicio.setHours(0, 0, 0, 0);
    ventanaFin.setHours(23, 59, 59, 999);

    const inicio = rawInicio < ventanaInicio ? ventanaInicio : rawInicio;
    const fin = rawFin > ventanaFin ? ventanaFin : rawFin;

    const duracionMs = fin.getTime() - inicio.getTime();
    const duracionDias = duracionMs / (1000 * 60 * 60 * 24);

    // En lugar de Math.floor, usamos Math.ceil para asegurar la cobertura completa
    return duracionDias > 0 ? Math.ceil(duracionDias + 1) : 0;
  }

  tooltipTarea(t: TaskWithCategoria): string {
    return `${t.nombreTarea}\n${t.fechaCreacionTarea} → ${t.fechaEntregaTarea}\nCategoría: ${t.categoriaObj?.nombreCategoria || 'Sin categoría'}`;
  }

  estaAntesDelRango(tarea: TaskWithCategoria): boolean {
    const inicio = new Date(tarea.fechaCreacionTarea as string);
    const ventanaInicio = new Date(this.fechasVentana[0]);
    inicio.setHours(0, 0, 0, 0);
    ventanaInicio.setHours(0, 0, 0, 0);
    return inicio < ventanaInicio;
  }

  estaDespuesDelRango(tarea: TaskWithCategoria): boolean {
    const fin = new Date(tarea.fechaEntregaTarea as string);
    const ventanaFin = new Date(this.fechasVentana[this.fechasVentana.length - 1]);
    fin.setHours(23, 59, 59, 999);
    ventanaFin.setHours(23, 59, 59, 999);
    return fin > ventanaFin;
  }

  setSemanaActual(): void {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const fechas = this.generarFechas();
    const index = fechas.findIndex(f =>
      f.getFullYear() === hoy.getFullYear() &&
      f.getMonth() === hoy.getMonth() &&
      f.getDate() === hoy.getDate()
    );
    this.windowStart = index >= 0 ? index - (index % this.windowSize) : 0;
  }

  moverAVistaDeTarea(tarea: TaskWithCategoria, direccion: 'izquierda' | 'derecha'): void {
    const fechas = this.generarFechas();
    const inicioTarea = new Date(tarea.fechaCreacionTarea as string);
    const finTarea = new Date(tarea.fechaEntregaTarea as string);

    inicioTarea.setHours(0, 0, 0, 0);
    finTarea.setHours(23, 59, 59, 999);

    if (direccion === 'izquierda') {
      // Mueve la ventana para mostrar el inicio de la tarea
      const index = fechas.findIndex(f => f.getTime() === inicioTarea.getTime());
      if (index !== -1) {
        this.windowStart = Math.max(0, index);
      }
    }

    if (direccion === 'derecha') {
      // Mueve la ventana para mostrar el final de la tarea
      const index = fechas.findIndex(f => f.getTime() === finTarea.getTime());
      if (index !== -1 && index - this.windowSize + 1 >= 0) {
        this.windowStart = index - this.windowSize + 1;
      } else if (index !== -1) {
        this.windowStart = 0;
      }
    }
  }

mostrarFlechaIzquierda(tarea: TaskWithCategoria): boolean {
    // Muestra la flecha si el inicio de la tarea es antes del inicio de la ventana
    const inicioTarea = new Date(tarea.fechaCreacionTarea as string);
    const inicioVentana = this.fechasVentana[0];
    inicioTarea.setHours(0, 0, 0, 0);
    inicioVentana.setHours(0, 0, 0, 0);
    return inicioTarea < inicioVentana;
  }

  mostrarFlechaDerecha(tarea: TaskWithCategoria): boolean {
    // Muestra la flecha si el fin de la tarea es después del final de la ventana
    const finTarea = new Date(tarea.fechaEntregaTarea as string);
    const finVentana = this.fechasVentana[this.fechasVentana.length - 1];
    finTarea.setHours(23, 59, 59, 999);
    finVentana.setHours(23, 59, 59, 999);
    return finTarea > finVentana;
  }

}