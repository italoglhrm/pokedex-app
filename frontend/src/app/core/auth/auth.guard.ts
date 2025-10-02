import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = async () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.isAuthenticated()) {
    return true;
  }

  try {
    await auth.fetchMe(); // tenta restaurar sessão do cookie
    return true;
  } catch {
    return router.parseUrl('/login') as UrlTree;
  }
};
