import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-create-routine',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-routine.html',
  styleUrls: ['./create-routine.css']
})
export class CreateRoutine {
  @Output() onSave = new EventEmitter<any>();
  @Output() onClose = new EventEmitter<void>();

  rutina = {
    nombreRutina: '',
    descripcion: '',
    horaInicio: '',
    duracion: null as number | null,
    diasRepeticion: [] as string[],
    pasos: [] as string[]
  };

  nuevoPaso = '';

  toggleDia(dia: string) {
    const index = this.rutina.diasRepeticion.indexOf(dia);
    if (index >= 0) this.rutina.diasRepeticion.splice(index, 1);
    else this.rutina.diasRepeticion.push(dia);
  }

  agregarPaso() {
    if (this.nuevoPaso.trim()) {
      this.rutina.pasos.push(this.nuevoPaso.trim());
      this.nuevoPaso = '';
    }
  }

  eliminarPaso(i: number) {
    this.rutina.pasos.splice(i, 1);
  }

  guardar() {
    this.onSave.emit(this.rutina);
  }

  cerrar() {
    this.onClose.emit();
  }
}
