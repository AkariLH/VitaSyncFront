import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { RoutineService, Routine, RegistroRutina } from '../service/service';
import { Sidebar } from '../../sidebar/sidebar';
import { CreateRoutine } from '../create-routine/create-routine';

@Component({
  selector: 'app-routines',
  standalone: true,
  templateUrl: './routines.html',
  styleUrls: ['./routines.css'],
  imports: [CommonModule, Sidebar, HttpClientModule, CreateRoutine],
  providers: [RoutineService]
})
export class Routines implements OnInit {
  rutinas: Routine[] = [];
  registrosRutina: RegistroRutina[] = [];
  pasosMarcados: { [rutinaId: number]: boolean[] } = {};
  showCreateModal = false;
  sidebarOpen = true;
  user = JSON.parse(localStorage.getItem('user') || '{}');

  constructor(
    private routineService: RoutineService,
    private http: HttpClient,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.routineService.getRoutinesByUser(this.user.id).subscribe({
      next: (rutinas) => {
        // Cargar subrutinas para cada rutina
        const subsRequests = rutinas.map(r =>
          this.routineService.getSubrutinasByRoutine(r.id)
        );
        Promise.all(subsRequests.map(obs => obs.toPromise())).then(subsArrays => {
          rutinas.forEach((rutina, idx) => {
            rutina.subrutinas = subsArrays[idx];
          });
          this.rutinas = rutinas;
          this.inicializarPasosMarcados();
          this.cdRef.detectChanges();
        });
      },
      error: () => alert('Error al cargar rutinas')
    });

    this.routineService.getRegistrosByUser(this.user.id).subscribe({
      next: (registros) => {
        this.registrosRutina = registros;
        this.inicializarPasosMarcados();
        this.cdRef.detectChanges();
      },
      error: () => alert('Error al cargar progreso de rutinas')
    });
  }

  inicializarPasosMarcados() {
    if (!this.rutinas || !this.registrosRutina) return;
    for (const rutina of this.rutinas) {
      const registro = this.getRegistroDeHoy(rutina.id);
      const completados = registro ? registro.pasosCompletados : 0;
      this.pasosMarcados[rutina.id] = rutina.subrutinas
        ? rutina.subrutinas.map((_, i) => i < completados)
        : [];
    }
  }

  crearRutina() {
    this.showCreateModal = true;
  }

  onSaveRutina(rutinaForm: any) {
    const userId = this.user.id;
    const routineDto = {
      nombreRutina: rutinaForm.nombreRutina,
      descripcionRutina: rutinaForm.descripcion,
      horaInicioRutina: rutinaForm.horaInicio,
      duracionRutinaMinutos: rutinaForm.duracion,
      repeticion: rutinaForm.diasRepeticion.join(','),
      activa: true,
      usuario: userId
    };

    this.routineService.createRoutine(routineDto).subscribe({
      next: (createdRoutine) => {
        this.rutinas.push(createdRoutine);
        this.inicializarPasosMarcados();
        this.cdRef.detectChanges();
      },
      error: () => alert('Error al crear rutina')
    });
  }

  getProgress(rutina: Routine, registro: RegistroRutina): number {
    let completados = 0;
    if (this.pasosMarcados[rutina.id]) {
      completados = this.pasosMarcados[rutina.id].filter(v => v).length;
    } else if (registro) {
      completados = registro.pasosCompletados || 0;
    }
    if (!rutina.subrutinas || rutina.subrutinas.length === 0) return 0;
    return Math.round((completados / rutina.subrutinas.length) * 100);
  }

  getCompleted(rutina: Routine, registro: RegistroRutina): number {
    if (this.pasosMarcados[rutina.id]) {
      return this.pasosMarcados[rutina.id].filter(v => v).length;
    }
    return registro?.pasosCompletados || 0;
  }

  getRegistroActual(rutinaId: number): RegistroRutina | undefined {
    // Puedes filtrar por fecha si quieres solo el de hoy
    return this.registrosRutina.find(r => {
      if (typeof r.rutina === 'number') return r.rutina === rutinaId;
      return r.rutina.id === rutinaId;
    });
  }

  getRegistroDeHoy(rutinaId: number): RegistroRutina | undefined {
    // Aquí puedes filtrar por fecha si lo necesitas
    return this.getRegistroActual(rutinaId);
  }

  isPasoChecked(rutina: Routine, index: number): boolean {
    return !!this.pasosMarcados[rutina.id]?.[index];
  }

  onPasoCheck(rutina: Routine, pasoIndex: number, event: any): void {
    if (!this.pasosMarcados[rutina.id]) return;

    if (event.target.checked) {
      // Solo permite marcar el siguiente paso si los anteriores están marcados
      const prevAllChecked = this.pasosMarcados[rutina.id]
        .slice(0, pasoIndex)
        .every(v => v);
      if (!prevAllChecked) {
        event.preventDefault();
        return;
      }
    } else {
      // Si desmarcas, desmarca todos los siguientes
      for (let i = pasoIndex; i < this.pasosMarcados[rutina.id].length; i++) {
        this.pasosMarcados[rutina.id][i] = false;
      }
    }

    this.pasosMarcados[rutina.id][pasoIndex] = event.target.checked;
    // Cambia la referencia para forzar actualización
    this.pasosMarcados[rutina.id] = [...this.pasosMarcados[rutina.id]];
    this.cdRef.detectChanges();

    let nuevosCompletados = 0;
    for (const marcado of this.pasosMarcados[rutina.id]) {
      if (marcado) nuevosCompletados++;
      else break;
    }

    let registro = this.getRegistroDeHoy(rutina.id);

    if (!registro) {
      const now = new Date();
      const fechaLocalDateTime = now.toISOString().slice(0, 19); // "2025-06-22T18:27:21"

      const nuevoRegistro = {
        rutina: { id: rutina.id },
        fecha: fechaLocalDateTime, // Siempre enviar con hora
        horaInicio: rutina.horaInicioRutina,
        pasosCompletados: nuevosCompletados
      };

      this.registrosRutina.push({
        id: -1,
        rutina: { id: rutina.id },
        fecha: nuevoRegistro.fecha,
        horaInicio: nuevoRegistro.horaInicio,
        pasosCompletados: nuevosCompletados
      });

      this.routineService.createRegistroRutina(nuevoRegistro).subscribe({
        next: (created) => {
          const idx = this.registrosRutina.findIndex(r =>
            typeof r.rutina !== 'number' &&
            r.rutina.id === rutina.id &&
            r.id === -1
          );
          if (idx !== -1) {
            this.registrosRutina[idx] = created;
            this.cdRef.detectChanges();
          }
        },
        error: () => alert('No se pudo crear el registro de rutina')
      });
    } else {
      this.routineService.updateRegistroRutina(registro.id, {
        rutina: { id: rutina.id },
        pasosCompletados: nuevosCompletados,
        fecha: registro.fecha,
        horaInicio: rutina.horaInicioRutina
      }).subscribe({
        next: (updated) => {
          registro.pasosCompletados = updated.pasosCompletados;
          this.cdRef.detectChanges();
        },
        error: () => alert('No se pudo actualizar el progreso')
      });
    }
  }

  editarRutina(rutina: Routine) {
    // Lógica para editar rutina
  }

  eliminarRutina(rutina: Routine) {
    // Lógica para eliminar rutina
  }
}
