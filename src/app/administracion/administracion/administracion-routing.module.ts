import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from 'src/app/auth/guard/auth.guard';

const routes: Routes = [
  {
    path: 'usuarios',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./usuarios/usuarios.module').then((m) => m.UsuariosModule),
    data: { expectedRoles: ['1'] } as any,
  },
  {
    path: 'roles',
    canActivate: [authGuard],
    loadChildren: () => import('./role/role.module').then((m) => m.RoleModule),
    data: { expectedRoles: ['1'] } as any,
  },
  {
    path: 'sucursales',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./sucursal/sucursal.module').then((m) => m.SucursalModule),
    data: { expectedRoles: ['1'] } as any,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdministracionRoutingModule {}
