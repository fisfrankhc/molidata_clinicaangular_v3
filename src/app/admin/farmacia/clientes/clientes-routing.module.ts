import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClientesIndexComponent } from './clientes-index/clientes-index.component';
import { ClientesNuevoComponent } from './clientes-nuevo/clientes-nuevo.component';

const routes: Routes = [
  {
    path: '',
    component: ClientesIndexComponent,
  },
  {
    path: 'nuevo',
    component: ClientesNuevoComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientesRoutingModule { }
