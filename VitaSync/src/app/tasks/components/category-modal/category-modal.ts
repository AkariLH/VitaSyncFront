import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoryService, Categoria } from '../../services/category';

@Component({
  selector: 'app-category-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './category-modal.html',
  styleUrls: ['./category-modal.css']
})
export class CategoryModal implements OnInit {
  @Output() onClose = new EventEmitter<void>();
  @Output() onUpdate = new EventEmitter<any>();

  categorias: Categoria[] = [];

  nuevaCategoria: Categoria = {
    nombreCategoria: '',
    colorCategoria: '#4CAF50'
  };

  coloresPredefinidos: string[] = [
    '#4CAF50', '#F44336', '#2196F3', '#FF9800',
    '#9C27B0', '#3F51B5', '#00BCD4', '#E91E63'
  ];

  editandoCategoriaId: number | null = null;

  constructor(private categoryService: CategoryService) {}

  ngOnInit() {
    this.loadCategorias();
  }

  loadCategorias(): void {
    this.categoryService.getAll().subscribe({
      next: (cats) => (this.categorias = cats),
      error: () => alert('Error al cargar categorías')
    });
  }

  seleccionarColor(color: string): void {
    this.nuevaCategoria.colorCategoria = color;
  }

  addOrUpdate(): void {
    if (!this.nuevaCategoria.nombreCategoria?.trim()) {
      alert('Debes escribir un nombre para la categoría');
      return;
    }

    if (this.editandoCategoriaId) {
      this.categoryService.update(this.nuevaCategoria).subscribe({
        next: (cat) => {
          const idx = this.categorias.findIndex(c => c.id === this.editandoCategoriaId);
          if (idx !== -1) this.categorias[idx] = cat;
          this.resetForm();
        },
        error: () => alert('Error al actualizar la categoría')
      });
    } else {
      // Añadir nueva
      this.categoryService.create(this.nuevaCategoria).subscribe({
        next: (cat) => {
          this.categorias.push(cat);
          this.resetForm();
        },
        error: () => alert('Error al crear la categoría')
      });
    }
  }

  edit(cat: Categoria) {
    this.nuevaCategoria = { ...cat };
    this.editandoCategoriaId = cat.id ?? null;
  }

  resetForm() {
    this.nuevaCategoria = {
      nombreCategoria: '',
      colorCategoria: '#4CAF50'
    };
    this.editandoCategoriaId = null;
  }

  delete(cat: Categoria) {
    if (cat.id) {
      this.categoryService.delete(cat.id).subscribe(() => {
        this.categorias = this.categorias.filter(c => c.id !== cat.id);
      });
    }
  }

  close() {
    this.onUpdate.emit(this.categorias);
    this.onClose.emit();
  }
}
