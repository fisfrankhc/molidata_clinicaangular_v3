import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ClinicaComponent } from './clinica.component';
import { CommonModule } from '@angular/common';
import { authGuard } from '../auth/guard/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: ClinicaComponent,
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
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), CommonModule],
  exports: [RouterModule],
})
export class ClinicaRoutingModule {}
