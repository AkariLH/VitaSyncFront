import { CommonModule } from '@angular/common';
import { Component, SimpleChanges, Input } from '@angular/core';
import { TaskService,Task } from '../../tasks/services/task';
import { CategoryService,Categoria } from '../../tasks/services/category';

interface Tarea {
  id: number;
  nombreTarea: string;
  fechaEntregaTarea: Date;
  categoria?: Categoria; 
}

interface DiaCalendario {
  fecha: Date;
  tareas: Tarea[];
  fueraDeMes?: boolean; // Nuevo
}

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './calendar.html',
  styleUrl: './calendar.css'
})
export class Calendar {
  categorias: Categoria[] = [];
  tareas: Tarea[] = [];
  vista: 'mensual' | 'semanal' | 'diaria' = 'mensual';

  hoy = new Date();
  diaActual = new Date();

  // Nuevo: mes y año seleccionados
  mesActual = this.hoy.getMonth();
  anioActual = this.hoy.getFullYear();


  diasMes: DiaCalendario[] = [];
  diasSemana: DiaCalendario[] = [];
  tareasDia: Tarea[] = [];

  usuarioId: number = 0;

  semanaActual: Date[] = []; // Array de 7 días (domingo a sábado)
  primerDiaSemana: Date = this.getStartOfWeek(new Date());

  horas: string[] = Array.from({length: 17}, (_, i) => `${i+6}:00`); // 6am a 22pm

  @Input() reload: boolean = false;

  constructor(private taskService: TaskService, private categoryService: CategoryService) {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.usuarioId = user?.id || 0;
    this.categoryService.getAll().subscribe(categorias => {
      this.categorias = categorias;
      this.cargarTareas();
    });
  }

  ngOnInit() {
    this.generarSemana();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['reload'] && !changes['reload'].firstChange) {
      this.cargarTareas(); // O el método que recarga tus datos
    }
  }

  cargarTareas() {
  this.taskService.getAll(this.usuarioId).subscribe(tasks => {
    this.tareas = tasks
      .filter(t => t.id !== undefined && t.fechaEntregaTarea)
      .map(t => {
        const fechaEntregaStr = t.fechaEntregaTarea!.includes('T')
          ? t.fechaEntregaTarea!
          : t.fechaEntregaTarea! + 'T12:00:00';
        return {
          id: t.id as number,
          nombreTarea: t.nombreTarea,
          fechaEntregaTarea: new Date(fechaEntregaStr),
          categoria: this.categorias.find(cat => cat.id === t.categoria) // <-- CORRECTO
        };
      });
    this.generarVista();
  });
}

  cambiarVista(vista: 'mensual' | 'semanal' | 'diaria') {
    this.vista = vista;
    this.generarVista();
  }

  cambiarMes(offset: number) {
    this.mesActual += offset;
    if (this.mesActual > 11) {
      this.mesActual = 0;
      this.anioActual++;
    } else if (this.mesActual < 0) {
      this.mesActual = 11;
      this.anioActual--;
    }
    this.generarVista();
  }

  getStartOfWeek(date: Date): Date {
    const d = new Date(date);
    d.setDate(d.getDate() - d.getDay());
    d.setHours(0,0,0,0);
    return d;
  }

  generarSemana() {
    this.primerDiaSemana = this.getStartOfWeek(this.diaActual);
    this.semanaActual = Array.from({length: 7}, (_, i) => {
      const d = new Date(this.primerDiaSemana);
      d.setDate(this.primerDiaSemana.getDate() + i);
      return d;
    });
  }

  cambiarSemana(offset: number) {
    this.diaActual = new Date(this.primerDiaSemana);
    this.diaActual.setDate(this.primerDiaSemana.getDate() + offset * 7);
    this.generarSemana();
    this.generarVista();
  }

  generarVista() {
    if (this.vista === 'mensual') {
      this.generarDiasMes();
    } else if (this.vista === 'semanal') {
      this.hoy = new Date(this.anioActual, this.mesActual, this.hoy.getDate());
      this.generarDiasSemana();
    } else if (this.vista === 'diaria') {
      this.generarTareasDia();
    }
  }

  generarDiasMes() {
    const year = this.anioActual;
    const month = this.mesActual;

    // Primer día del mes
    const firstDay = new Date(year, month, 1);
    // Último día del mes
    const lastDay = new Date(year, month + 1, 0);

    // Día de la semana del primer día (0=domingo)
    const startDayOfWeek = firstDay.getDay();
    // Día de la semana del último día
    const endDayOfWeek = lastDay.getDay();

    // Días del mes anterior para rellenar
    const daysFromPrevMonth = startDayOfWeek;
    // Días del mes siguiente para rellenar
    const daysFromNextMonth = 6 - endDayOfWeek;

    this.diasMes = [];

    // Días del mes anterior
    for (let i = daysFromPrevMonth; i > 0; i--) {
      const date = new Date(year, month, 1 - i);
      this.diasMes.push({
        fecha: date,
        tareas: this.tareas.filter(t => this.mismaFecha(new Date(t.fechaEntregaTarea), date)),
        fueraDeMes: true
      } as any);
    }

    // Días del mes actual
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const date = new Date(year, month, i);
      this.diasMes.push({
        fecha: date,
        tareas: this.tareas.filter(t => this.mismaFecha(new Date(t.fechaEntregaTarea), date)),
        fueraDeMes: false
      } as any);
    }

    // Días del mes siguiente
    for (let i = 1; i <= daysFromNextMonth; i++) {
      const date = new Date(year, month + 1, i);
      this.diasMes.push({
        fecha: date,
        tareas: this.tareas.filter(t => this.mismaFecha(new Date(t.fechaEntregaTarea), date)),
        fueraDeMes: true
      } as any);
    }
  }

  generarDiasSemana() {
    const diaSemana = this.hoy.getDay();
    const inicioSemana = new Date(this.hoy);
    inicioSemana.setDate(this.hoy.getDate() - diaSemana);
    this.diasSemana = [];
    for (let i = 0; i < 7; i++) {
      const dia = new Date(inicioSemana);
      dia.setDate(inicioSemana.getDate() + i);
      this.diasSemana.push({
        fecha: dia,
        tareas: this.tareas.filter(t => this.mismaFecha(t.fechaEntregaTarea, dia))
      });
    }
  }

  generarTareasDia() {
    this.tareasDia = this.tareas.filter(t => this.mismaFecha(t.fechaEntregaTarea, this.diaActual));
  }

  seleccionarDia(dia: DiaCalendario) {
    this.diaActual = dia.fecha;
    this.cambiarVista('diaria');
  }

  editarTarea(tarea: Tarea, event: MouseEvent) {
    event.stopPropagation();
    // Aquí puedes abrir un modal o navegar a la edición de la tarea
    alert(`Editar tarea: ${tarea.nombreTarea}`);
  }

  mismaFecha(a: Date, b: Date): boolean {
    return a.getDate() === b.getDate() &&
           a.getMonth() === b.getMonth() &&
           a.getFullYear() === b.getFullYear();
  }

  irAHoy() {
    this.hoy = new Date();
    this.diaActual = new Date();
    this.mesActual = this.hoy.getMonth();
    this.anioActual = this.hoy.getFullYear();
    this.generarVista();
  }

  cambiarDia(offset: number) {
    this.diaActual = new Date(this.diaActual);
    this.diaActual.setDate(this.diaActual.getDate() + offset);
    this.generarVista(); // O el método que actualiza las tareas del día
  }

  getTareasDelDia(dia: Date) {
    return this.tareas.filter(t =>
      this.mismaFecha(t.fechaEntregaTarea, dia)
    );
  }

  getEventosDelDiaYHora(dia: Date, hora: string) {
    return this.tareas.filter(t =>
      this.mismaFecha(t.fechaEntregaTarea, dia)
    );
  }
}
