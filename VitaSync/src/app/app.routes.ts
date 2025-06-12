import { Routes } from '@angular/router';
import { Tasks } from './tasks/pages/tasks';
import { TaskCreate } from './tasks/components/task-create/task-create';
import { CategoryModal } from './tasks/components/category-modal/category-modal';
import { Routines } from './routines/routines/routines';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth-routing.module').then(m => m.AuthRoutingModule)
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'auth/login'
  },
  {path: 'tareas', component: Tasks},
  {path: 'taskscreate', component: TaskCreate},
  {path: 'categorias', component: CategoryModal},
  {path: 'rutinas', component: Routines},
  {
  path: '**',
    redirectTo: 'auth/login'
  }
];