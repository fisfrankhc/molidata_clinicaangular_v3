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
      },
      {
        path: 'roles',
        loadChildren: () =>
          import('./roles/roles.module').then((m) => m.RolesModule),
      },
      {
        path: 'sucursal',
        loadChildren: () =>
          import('./sucursal/sucursal.module').then((m) => m.SucursalModule),
      },
      {
        path: 'logistica',
        loadChildren: () =>
          import('./logistica/logistica.module').then((m) => m.LogisticaModule),
      },
      {
        path: 'farmacia',
        loadChildren: () =>
          import('./farmacia/farmacia.module').then((m) => m.FarmaciaModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), CommonModule],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
