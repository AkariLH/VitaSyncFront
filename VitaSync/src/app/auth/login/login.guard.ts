import { CanActivateFn } from '@angular/router';

export const loginGuard: CanActivateFn = (route, state) => {
  const user = localStorage.getItem('user');
  if (user) {
    window.location.href = '/dashboard';
    return false;
  }
  return true;
};