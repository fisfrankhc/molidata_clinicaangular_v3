import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CajaIndexComponent } from './caja-index/caja-index.component';
import { CajaVerComponent } from './caja-ver/caja-ver.component';

const routes: Routes = [
  {
    path: '',
    component: CajaIndexComponent,
  },
  {
    path: 'ver/:venta_id',
    component: CajaVerComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CajaRoutingModule { }
