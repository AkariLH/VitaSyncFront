import { Component } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-recover-password',
  templateUrl: './recover-password.html',
  styleUrls: ['./recover-password.css'],
  imports: [CommonModule, ReactiveFormsModule]
})
export class RecoverPasswordComponent {
  recoverForm: FormGroup;
  submitted = false;
  success = false;

  constructor(private fb: FormBuilder, private router: Router) {
    this.recoverForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  get f() {
    return this.recoverForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.recoverForm.invalid) return;

    this.success = true;
    // Simulación: podrías aquí hacer llamada a servicio real
  }

  goToLogin(): void {
    this.router.navigate(['/auth/login']);
  }
}
