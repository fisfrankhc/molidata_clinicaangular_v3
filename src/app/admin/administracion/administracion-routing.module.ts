import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'configurar-codigo-sucursal',
    loadChildren: () =>
      import('./configurar-codigo/configurar-codigo.module').then((m) => m.ConfigurarCodigoModule),
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdministracionRoutingModule { }
