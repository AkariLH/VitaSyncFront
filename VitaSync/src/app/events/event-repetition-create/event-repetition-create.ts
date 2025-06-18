import { Component, Output, EventEmitter } from '@angular/core';
import { Evento } from '../services/evento';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-event-repetition-create',
  templateUrl: './event-repetition-create.html',
  styleUrls: ['./event-repetition-create.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class EventRepetitionCreate {
  @Output() onClose = new EventEmitter<void>();
  @Output() onCreate = new EventEmitter<any>();

  repeticion: any = {
    intervalo: 1,
    tipo: 'SEMANAL',
    dias: [new Date().getDay()], // Por defecto el día actual
    finTipo: 'nunca',
    finFecha: null,
    finOcurrencias: null
  };

  tipos = [
    { value: 'DIARIA', label: 'Día(s)' },
    { value: 'SEMANAL', label: 'Semana(s)' },
    { value: 'MENSUAL', label: 'Mes(es)' },
    { value: 'ANUAL', label: 'Año(s)' }
  ];

  diasSemana = ['D', 'L', 'M', 'M', 'J', 'V', 'S'];

  constructor(private eventoService: Evento) {}

  toggleDia(i: number) {
    if (!this.repeticion.dias) this.repeticion.dias = [];
    const idx = this.repeticion.dias.indexOf(i);
    if (idx > -1) this.repeticion.dias.splice(idx, 1);
    else this.repeticion.dias.push(i);
  }

  onTipoChange() {
    if (this.repeticion.tipo !== 'SEMANAL') {
      this.repeticion.dias = [];
    }
  }

  crearRepeticion() {
    // Construye el objeto según lo que espera tu backend
    const data: any = {
      intervalo: this.repeticion.intervalo,
      tipo: this.repeticion.tipo,
      dias: this.repeticion.tipo === 'SEMANAL' ? this.repeticion.dias : null,
    };
    if (this.repeticion.finTipo === 'fecha') data.fin = this.repeticion.finFecha;
    else if (this.repeticion.finTipo === 'ocurrencias') data.ocurrencias = this.repeticion.finOcurrencias;

    this.eventoService.createRepeticion(data).subscribe({
      next: (rep) => {
        this.onCreate.emit(rep);
        this.closeModal();
      },
      error: err => {
        alert('Error al crear repetición');
        console.error(err);
      }
    });
  }

  closeModal() {
    this.onClose.emit();
  }
}
