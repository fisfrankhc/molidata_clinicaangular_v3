import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from 'src/app/auth/guard/auth.guard';

const routes: Routes = [
  {
    path: 'clientes',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./clientes/clientes.module').then((m) => m.ClientesModule),
    data: { expectedRoles: ['1'] } as any,
  },
  {
    path: 'pacientes',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./pacientes/pacientes.module').then((m) => m.PacientesModule),
    data: { expectedRoles: ['1'] } as any,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CitaRoutingModule {}
