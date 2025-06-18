import { Component, Output, EventEmitter } from '@angular/core';
import { Evento } from '../services/evento';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-event-category-create',
  templateUrl: './event-category-create.html',
  styleUrls: ['./event-category-create.css'],
  standalone: true,
  imports: [CommonModule,FormsModule]
})
export class EventCategoryCreate {
  @Output() onClose = new EventEmitter<void>();
  @Output() onCreate = new EventEmitter<any>();

  categoria: any = {
    nombre: '',
    color: '#4DB6AC'
  };

  coloresPredeterminados: string[] = [
    '#4DB6AC', '#8E24AA', '#FF7043', '#42A5F5', '#66BB6A', '#FFD600', '#F06292', '#78909C'
  ];

  constructor(private eventoService: Evento) {}

  crearCategoria() {
    this.eventoService.createCategoria(this.categoria).subscribe({
      next: (cat) => {
        this.onCreate.emit(cat);
        this.closeModal();
      },
      error: err => {
        alert('Error al crear categoría');
        console.error(err);
      }
    });
  }

  closeModal() {
    this.onClose.emit();
  }
}
