import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService, LoginPayload } from '../../auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule]
})
export class LoginComponent {
  loginForm: FormGroup;
  submitted = false;
  errorMessage = '';

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  get f() {
    return this.loginForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.loginForm.invalid) return;

    const payload: LoginPayload = {
      correoElectronico: this.loginForm.value.email,
      claveAcceso: this.loginForm.value.password
    };

    this.authService.login(payload).subscribe({
      next: (user) => {
        console.log('Usuario autenticado:', user);
        localStorage.setItem('user', JSON.stringify(user)); // Guarda sesión
        this.router.navigate(['/dashboard']); // Redirige al panel
      },
      error: (err) => {
        console.error('Error de login:', err);
        this.errorMessage = 'Correo o contraseña incorrectos';
      }
    });
  }
}
