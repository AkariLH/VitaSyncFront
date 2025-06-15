import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-kanban',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './kanban.html',
  styleUrl: './kanban.css'
})
export class Kanban {
  columnas: Columna[] = ['Por Hacer', 'En Progreso', 'En Revisión', 'Hecho'];
  tareas: Record<Columna, { titulo: string; categoria: string; prioridad: string; fecha: string; }[]> = {
    'Por Hacer': [
      { titulo: 'Compra de Supermercado', categoria: 'Hogar', prioridad: 'Media', fecha: '30 jul' },
      { titulo: 'Estudiar React', categoria: 'Estudio', prioridad: 'Alta', fecha: '5 ago' }
    ],
    'En Progreso': [
      { titulo: 'Informe Proyecto Q3', categoria: 'Trabajo', prioridad: 'Alta', fecha: '2 ago' }
    ],
    'En Revisión': [
      { titulo: 'Revisar Propuesta X', categoria: 'Trabajo', prioridad: 'Alta', fecha: '31 jul' }
    ],
    'Hecho': [
      { titulo: 'Sesión de Gimnasio', categoria: 'Salud', prioridad: 'Media', fecha: '28 jul' }
    ]
  };
}

type Columna = 'Por Hacer' | 'En Progreso' | 'En Revisión' | 'Hecho';

