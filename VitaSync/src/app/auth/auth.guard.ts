import { Injectable } from '@angular/core';
import { CanActivateFn } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const user = localStorage.getItem('user');
  if (user) {
    return true;
  } else {
    window.location.href = '/auth/login';
    return false;
  }
};