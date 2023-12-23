import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from 'src/app/auth/guard/auth.guard';

const routes: Routes = [
  {
    path: 'configurar-codigo-sucursal',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./configurar-codigo/configurar-codigo.module').then(
        (m) => m.ConfigurarCodigoModule
      ),
    data: { expectedRoles: ['1', '5'] } as any,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdministracionRoutingModule { }
