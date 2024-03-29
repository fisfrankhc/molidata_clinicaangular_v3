import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AdministracionComponent } from './administracion.component';
import { CommonModule } from '@angular/common';
import { authGuard } from '../auth/guard/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: AdministracionComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
        data: {
          expectedRoles: ['1', '2', '3', '4', '5', '6', '7', '8'],
        },
      },
      {
        path: 'administracion',
        loadChildren: () =>
          import('./administracion/administracion.module').then(
            (m) => m.AdministracionModule
          ),
        data: { expectedRoles: ['1'] } as any,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), CommonModule],
  exports: [RouterModule],
})
export class AdministracionRoutingModule {}
