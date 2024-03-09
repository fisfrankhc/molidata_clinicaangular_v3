import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TransferenciasIndexComponent } from './transferencias-index/transferencias-index.component';
import { TransferenciasNuevoComponent } from './transferencias-nuevo/transferencias-nuevo.component';
import { TransferenciasVerComponent } from './transferencias-ver/transferencias-ver.component';

const routes: Routes = [
  {
    path: '',
    component: TransferenciasIndexComponent,
  },
  {
    path: 'nuevo',
    component: TransferenciasNuevoComponent,
  },
  {
    path: 'ver/:movimiento_id',
    component: TransferenciasVerComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TransferenciasRoutingModule {}
