import { CanActivateFn } from '@angular/router';

import { AuthloginService } from '../services/authlogin.service';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  //console.log("Se ejecuta el guard, usuario autenticado")
  const authService = inject(AuthloginService);
  const router = inject(Router);

  //console.log('Guardia activada');

  if (localStorage.getItem('authenticated')) {
    //return true;
    // Verificar rol
    //console.log(route.children);
    const expectedRoles = route.children?.[0]?.data?.['expectedRoles'] || [];
    const userRole = authService.getRole();

    //console.log('Roles esperados:', expectedRoles);
    //console.log('Rol del usuario:', userRole);

    if (
      expectedRoles.length === 0 ||
      (userRole && expectedRoles.includes(userRole))
    ) {
      //console.log('Acceso permitido');
      return true; // Acceso permitido
    } else {
      return router.parseUrl('/dashboard');
    }
  }
  console.log('Redireccionando a /login');
  return router.parseUrl('/login');
  //return true;
};
