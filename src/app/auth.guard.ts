// src/app/auth.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';

  if (!isLoggedIn) {
    router.navigate(['/login']);
    return false;
  }

  return true;
};
