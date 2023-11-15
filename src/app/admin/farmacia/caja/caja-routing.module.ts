import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CajaIndexComponent } from './caja-index/caja-index.component';
import { CajaVerComponent } from './caja-ver/caja-ver.component';
import { CajaVerPagadasComponent } from './caja-ver-pagadas/caja-ver-pagadas.component';

const routes: Routes = [
  {
    path: '',
    component: CajaIndexComponent,
  },
  {
    path: 'ver/:venta_id',
    component: CajaVerComponent,
  },
  {
    path: 'venta-pagada/:venta_id',
    component: CajaVerPagadasComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CajaRoutingModule { }
