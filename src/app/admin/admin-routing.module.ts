import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { CommonModule } from '@angular/common';

import { authGuard } from '../auth/guard/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
        data: { expectedRoles: ['1', '2', '3', '4'] },
      },
      {
        path: 'roles',
        loadChildren: () =>
          import('./roles/roles.module').then((m) => m.RolesModule),
        data: { expectedRoles: ['1', '3', '4'] },
      },
      {
        path: 'sucursal',
        loadChildren: () =>
          import('./sucursal/sucursal.module').then((m) => m.SucursalModule),
        data: { expectedRoles: ['1', '3', '4'] } as any,
      },
      {
        path: 'logistica',
        loadChildren: () =>
          import('./logistica/logistica.module').then((m) => m.LogisticaModule),
        data: { expectedRoles: ['1', '3', '4'] } as any,
      },
      {
        path: 'farmacia',
        loadChildren: () =>
          import('./farmacia/farmacia.module').then((m) => m.FarmaciaModule),
        data: { expectedRoles: ['1', '2', '3', '4'] } as any,
      },
      {
        path: 'almacen',
        loadChildren: () =>
          import('./almacen/almacen.module').then((m) => m.AlmacenModule),
        data: { expectedRoles: ['1', '3', '4'] } as any,
      },
      {
        path: 'contable',
        loadChildren: () =>
          import('./contable/contable.module').then((m) => m.ContableModule),
        data: { expectedRoles: ['1', '3', '4'] } as any,
      },
      {
        path: 'administracion',
        loadChildren: () =>
          import('./administracion/administracion.module').then((m) => m.AdministracionModule),
        data: { expectedRoles: ['1', '3', '4'] } as any,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), CommonModule],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
