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
  nuevaCategoria: Categoria = { nombreCategoria: '', colorCategoria: '#000000' };

  constructor(private categoryService: CategoryService) {}

  ngOnInit() {
    this.loadCategorias();
  }

  loadCategorias() {
    this.categoryService.getAll().subscribe(cats => this.categorias = cats);
  }

  add() {
    if (this.nuevaCategoria.nombreCategoria.trim()) {
      if (this.nuevaCategoria.id) {
        // Actualizar categoría existente
        this.categoryService.update(this.nuevaCategoria).subscribe(cat => {
          const idx = this.categorias.findIndex(c => c.id === cat.id);
          if (idx > -1) this.categorias[idx] = cat;
          this.nuevaCategoria = { nombreCategoria: '', colorCategoria: '#000000' };
        });
      } else {
        // Crear nueva categoría
        this.categoryService.create(this.nuevaCategoria).subscribe(cat => {
          this.categorias.push(cat);
          this.nuevaCategoria = { nombreCategoria: '', colorCategoria: '#000000' };
        });
      }
    }
  }

  delete(cat: Categoria) {
    if (cat.id) {
      this.categoryService.delete(cat.id).subscribe(() => {
        this.categorias = this.categorias.filter(c => c.id !== cat.id);
      });
    }
  }

  edit(cat: Categoria) {
    this.nuevaCategoria = { ...cat };
  }

  close() {
    this.onUpdate.emit(this.categorias);
    this.onClose.emit();
  }
}
