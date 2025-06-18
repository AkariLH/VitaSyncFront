import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Evento} from '../services/evento';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-event-create',
  templateUrl: './event-create.html',
  styleUrls: ['./event-create.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class EventCreate implements OnInit {
  @Input() usuarioId!: number;
  @Output() onClose = new EventEmitter<void>();
  @Output() onCreate = new EventEmitter<any>();

  evento: any = {
    nombreEvento: '',
    descripcionEvento: '',
    ubicacionEvento: '',
    fechaInicioEvento: '',
    fechaFinEvento: '',
    allday: false,
    repetirId: null,
    categoriaId: null,
    usuarioId: null
  };

  categorias: any[] = [];
  repeticiones: any[] = [];

  constructor(private eventoService: Evento) {}

  ngOnInit() {
    this.evento.usuarioId = this.usuarioId;
    this.eventoService.getCategorias().subscribe(cats => this.categorias = cats);
    this.eventoService.getRepeticiones().subscribe(reps => this.repeticiones = reps);
  }

  crearEvento() {
    this.evento.usuarioId = this.usuarioId;
    this.eventoService.createEvento(this.evento).subscribe({
      next: (ev) => {
        this.onCreate.emit(ev);
        this.closeModal();
      },
      error: err => {
        alert('Error al crear evento');
        console.error(err);
      }
    });
  }

  closeModal() {
    this.onClose.emit();
  }

  abrirModalCategoria() {
    // Aquí puedes abrir el modal para crear categoría
  }

  abrirModalRepeticion() {
    // Aquí puedes abrir el modal para crear repetición
  }
}
