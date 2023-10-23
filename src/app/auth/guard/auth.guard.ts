import { CanActivateFn } from '@angular/router';

import { AuthloginService } from '../services/authlogin.service';
import { Inject, inject } from '@angular/core';
import { Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {

  //console.log("Se ejecuta el guard, usuario autenticado")
  const authService = inject(AuthloginService);
  const router = inject(Router);

  if (localStorage.getItem('authenticated')) {
    return true;
  }
  return router.parseUrl('/login');
  //return true;

};
