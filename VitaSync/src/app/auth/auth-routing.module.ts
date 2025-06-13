import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RecoverPasswordComponent } from './recover-password/recover-password';
import { Register } from './register/register';
import { loginGuard } from './login/login.guard'; // Asegúrate de tener un guard para login si es necesario
const routes: Routes = [
  { path: 'login', component: LoginComponent, canActivate: [loginGuard] }, // Protege la ruta de login con el guard
  { path: 'recover-password', component: RecoverPasswordComponent, canActivate: [loginGuard] }, // Protege la ruta de recuperación de contraseña
  { path: '', redirectTo: 'login', pathMatch: 'full' }, // Redirige a login por defecto
  { path: 'register', component: Register, canActivate: [loginGuard] } // Ruta para el registro
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }