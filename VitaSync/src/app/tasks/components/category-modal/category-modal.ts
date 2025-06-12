import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-category-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './category-modal.html',
  styleUrls: ['./category-modal.css']
})
export class CategoryModal {
  @Output() onClose = new EventEmitter<void>();
  @Output() onUpdate = new EventEmitter<any>();

  categorias = [
    { nombre: 'Personal', color: '#42A5F5' },
    { nombre: 'Trabajo', color: '#66BB6A' },
    { nombre: 'Salud', color: '#FFA726' },
    { nombre: 'Estudio', color: '#AB47BC' }
  ];

  nuevaCategoria = { nombre: '', color: '#000000' };

  add() {
    if (this.nuevaCategoria.nombre.trim()) {
      this.categorias.push({ ...this.nuevaCategoria });
      this.nuevaCategoria = { nombre: '', color: '#000000' };
    }
  }

  delete(cat: any) {
    this.categorias = this.categorias.filter(c => c !== cat);
  }

  edit(cat: any) {
    this.nuevaCategoria = { ...cat };
    this.delete(cat);
  }

  close() {
    this.onUpdate.emit(this.categorias);
    this.onClose.emit();
  }
}
