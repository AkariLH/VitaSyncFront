import { Component } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../auth';

@Component({
  standalone: true,
  selector: 'app-register',
  templateUrl: './register.html',
  styleUrls: ['./register.css'],
  imports: [CommonModule, ReactiveFormsModule, RouterModule]
})
export class Register {
  registerForm: FormGroup;
  submitted = false;

  constructor(private fb: FormBuilder, private router: Router, private authService: AuthService) {
    this.registerForm = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, {
      validators: this.matchPasswords
    });
  }

  get f() {
    return this.registerForm.controls;
  }

  matchPasswords(group: FormGroup) {
    const pass = group.get('password')?.value;
    const confirm = group.get('confirmPassword')?.value;
    return pass === confirm ? null : { mismatch: true };
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.registerForm.invalid) return;

    const payload = {
      nombreUsuario: this.registerForm.value.nombre,
      apellidoUsuario: this.registerForm.value.apellido,
      correoElectronico: this.registerForm.value.email,
      claveAcceso: this.registerForm.value.password
    };

    this.authService.register(payload).subscribe({
      next: () => {
        alert('Cuenta creada exitosamente ✅');
        this.router.navigate(['/auth/login']);
      },
      error: (err) => {
        alert('Error al crear la cuenta');
        console.error(err);
      }
    });
  }
}
