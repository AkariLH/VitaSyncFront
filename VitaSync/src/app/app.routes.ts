import { Routes } from '@angular/router';
import { Tasks } from './tasks/pages/tasks';
import { TaskCreate } from './tasks/components/task-create/task-create';
import { CategoryModal } from './tasks/components/category-modal/category-modal';
import { Routines } from './routines/routines/routines';
import { Dashboard } from './dashboard/dashboard';
import { authGuard } from './auth/auth.guard';
import { loginGuard } from './auth/login/login.guard';
import { Sidebar } from './sidebar/sidebar';
import { Planning } from './planning/planning/planning';
import { Habits } from './habits/habits/habits';
import { ShoppingList } from './shopping-list/shopping-list';
import { Emotional } from './emotional/emotional';
import { Chores } from './chores/chores';
import { Finance } from './finance/finance';
import { Settings } from './settings/settings';
import { EventCreate } from './events/event-create/event-create';
import { EventCategoryCreate } from './events/event-category-create/event-category-create';
import { EventRepetitionCreate } from './events/event-repetition-create/event-repetition-create';
import { CreateRoutine } from './routines/create-routine/create-routine';
import { CreateHabit } from './habits/create-habit/create-habit';
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
  { path: 'auth/login', loadComponent: () => import('./auth/login/login.component').then(m => m.LoginComponent), canActivate: [loginGuard] },
  { path: 'tasks', loadComponent: () => import('./tasks/pages/tasks').then(m => m.Tasks), canActivate: [authGuard] },
  {path: 'taskscreate', component: TaskCreate},
  {path: 'categorias', component: CategoryModal},
  {path: 'rutinas', component: Routines},
  {path: 'dashboard', loadComponent: () => import('./dashboard/dashboard').then(m => m.Dashboard), canActivate: [authGuard] },
  {path: 'sidebar', component: Sidebar},
  {path: 'planificacion', component: Planning},
  {path: 'habitos', component: Habits},
  {path: 'listas-compras', component: ShoppingList},
  {path: 'emocional', component: Emotional},
  {path: 'quehaceres', component: Chores},
  {path: 'finanzas', component: Finance},
  {path: 'configuracion', component: Settings},
  {path: 'eventos/crear', component: EventCreate },
  {path: 'eventos/categorias', component: EventCategoryCreate },
  {path: 'eventos/repeticion', component: EventRepetitionCreate },
  {path: 'rutinas/crear', component: CreateRoutine},
  {path: 'habitos/crear', component: CreateHabit}
];