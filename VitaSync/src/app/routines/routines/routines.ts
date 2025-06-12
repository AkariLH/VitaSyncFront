import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-routines',
  standalone: true,
  templateUrl: './routines.html',
  styleUrls: ['./routines.css'],
  imports: [CommonModule]
})
export class Routines {
  rutinas = [
    {
      nombre: 'Rutina Matutina',
      descripcion: 'Comienza el día fresco y productivo.',
      frecuencia: 'Diaria',
      hora: '07:00',
      duracion: 60,
      pasosCompletados: 2,
      pasos: [
        { nombre: 'Beber Agua', completado: true },
        { nombre: 'Meditar 10 min', completado: false },
        { nombre: 'Planificar Día', completado: true }
      ]
    },
    {
      nombre: 'Relajación Nocturna',
      descripcion: 'Prepárate para un sueño reparador.',
      frecuencia: 'Lu, Ma, Mi, Ju, Vi',
      hora: '21:30',
      duracion: 45,
      pasosCompletados: 1,
      pasos: [
        { nombre: 'Leer un libro', completado: false },
        { nombre: 'Sin pantallas 1h antes de dormir', completado: false },
        { nombre: 'Estiramientos suaves', completado: true }
      ]
    }
  ];

  togglePaso(rutina: any, index: number) {
    const paso = rutina.pasos[index];
    paso.completado = !paso.completado;
    rutina.pasosCompletados = rutina.pasos.filter((p: any) => p.completado).length;
  }

  crearRutina() {
    console.log('Abrir modal para crear nueva rutina');
  }
}
