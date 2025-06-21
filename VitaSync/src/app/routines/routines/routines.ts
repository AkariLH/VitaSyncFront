import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Sidebar } from '../../sidebar/sidebar';
import { RoutineService, Routine } from '../service/service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-routines',
  standalone: true,
  templateUrl: './routines.html',
  styleUrls: ['./routines.css'],
  imports: [CommonModule, Sidebar, HttpClientModule],
  providers: [RoutineService]
})
export class Routines implements OnInit {
  sidebarOpen = true;
  rutinas: Routine[] = [];
  user = JSON.parse(localStorage.getItem('user') || '{}');

  constructor(private routineService: RoutineService) {}

  ngOnInit() {
    if (this.user?.id) {
      this.routineService.getRoutinesByUser(this.user.id).subscribe({
        next: (rutinas) => {
          // Cargar subrutinas para cada rutina
          rutinas.forEach(rutina => {
            this.routineService.getSubrutinasByRoutine(rutina.id).subscribe(subs => {
              rutina.subrutinas = subs;
            });
          });
          this.rutinas = rutinas;
        },
        error: () => alert('Error al cargar rutinas')
      });
    }
  }

  togglePaso(rutina: Routine, index: number) {
    // Aquí puedes implementar lógica para marcar pasos como completados (local o backend)
    if (rutina.subrutinas) {
      // Ejemplo: alternar completado localmente
      // rutina.subrutinas[index].completado = !rutina.subrutinas[index].completado;
    }
  }

  crearRutina() {
    console.log('Abrir modal para crear nueva rutina');
  }
}
