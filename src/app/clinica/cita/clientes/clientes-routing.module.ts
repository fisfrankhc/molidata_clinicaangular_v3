import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClientesIndexComponent } from './clientes-index/clientes-index.component';
import { ClientesNuevoComponent } from './clientes-nuevo/clientes-nuevo.component';
import { ClientesEditarComponent } from './clientes-editar/clientes-editar.component';

const routes: Routes = [
  {
    path: '',
    component: ClientesIndexComponent,
  },
  {
    path: 'nuevo',
    component: ClientesNuevoComponent,
  },
  {
    path: 'editar/:cli_id',
    component: ClientesEditarComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClientesRoutingModule {}
