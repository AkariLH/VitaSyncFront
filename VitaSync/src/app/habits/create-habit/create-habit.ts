import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Habit } from '../habit/habit'; 
import { Input } from '@angular/core';

@Component({
  selector: 'app-create-habit',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  standalone: true,
  templateUrl: './create-habit.html',
  styleUrl: './create-habit.css'
})
export class CreateHabit {
  @Output() habitCreated = new EventEmitter<any>();
  @Output() close = new EventEmitter<void>();
  @Input() usuarioId!: number; 

  habitForm: FormGroup;
  frecuencias = ['DIARIA', 'SEMANAL', 'MENSUAL', 'ANUAL'];
  loading = false;
  error= '';

  constructor(private fb: FormBuilder, private habitService: Habit) {
    this.habitForm = this.fb.group({
      nombre: ['', Validators.required],
      descipcion: [''],
      frecuencia: ['', Validators.required],
      objetivo: [1, [Validators.required, Validators.min(1)]],
      inicio: ['', Validators.required],
      fin: [''],
      activo: [true]
    });
  }

  onSubmit() {
    if (this.habitForm.valid) {
      this.loading = true;
      const habitData = {
        ...this.habitForm.value,
        usuario: { id: this.usuarioId }
      };
      console.log('Enviando al backend:', habitData);
      this.habitService.crearHabito(habitData).subscribe({
        next: (nuevoHabito) => {
          this.habitCreated.emit(nuevoHabito);
          this.habitForm.reset();
          this.loading = false;
        },
        error: () => {
          this.error = 'Error al crear el hábito';
          this.loading = false;
        }
      });
    }
  }

  onClose() {
    this.close.emit();
  }
}