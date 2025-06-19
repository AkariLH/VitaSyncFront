import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { Evento} from '../services/evento';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { EventCategoryCreate } from '../event-category-create/event-category-create';
import { EventRepetitionCreate } from '../event-repetition-create/event-repetition-create';

@Component({
  selector: 'app-event-create',
  templateUrl: './event-create.html',
  styleUrls: ['./event-create.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, EventCategoryCreate, EventRepetitionCreate]
})
export class EventCreate implements OnInit, OnChanges {
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

  showCategoriaModal = false;
  showRepeticionModal = false;
  categorias: any[] = [];
  repeticiones: any[] = [];
  constructor(private eventoService: Evento, private router: Router) {}

  ngOnInit() {
    this.evento.usuarioId = this.usuarioId;
    this.eventoService.getCategorias().subscribe(cats => this.categorias = cats);
    this.eventoService.getRepeticiones().subscribe(reps => this.repeticiones = reps);
  }
  

  ngOnChanges(changes: SimpleChanges) {
    if (changes['usuarioId'] && changes['usuarioId'].currentValue) {
      this.evento.usuarioId = changes['usuarioId'].currentValue;
    }
  }

  crearEvento() {
    // Recupera el usuarioId desde localStorage
    const user = localStorage.getItem('user');
    if (user) {
      const usuario = JSON.parse(user);
      this.evento.usuarioId = usuario.id || usuario.usuarioId; // Ajusta según tu modelo
    } else {
      alert('No hay sesión activa');
      this.router.navigate(['/login']);
      return;
    }
    console.log('Datos enviados al backend:', this.evento);
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
    this.showCategoriaModal = true;
  }

  cerrarModalCategoria() {
    this.showCategoriaModal = false;
  }

  categoriaCreada(cat: any) {
    this.categorias.push(cat);
    this.evento.categoriaId = cat.id;
    this.cerrarModalCategoria();
  }

  abrirModalRepeticion() {
    this.showRepeticionModal = true;
  }

  cerrarModalRepeticion() {
    this.showRepeticionModal = false;
  }

  repeticionCreada(rep: any) {
    this.repeticiones.push(rep);
    this.evento.repetirId = rep.id;
    this.cerrarModalRepeticion();
  }
}
