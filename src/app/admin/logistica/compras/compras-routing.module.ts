import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ComprasIndexComponent } from './compras-index/compras-index.component';
import { ComprasNuevoComponent } from './compras-nuevo/compras-nuevo.component';
import { ComprasVerComponent } from './compras-ver/compras-ver.component';

const routes: Routes = [
  {
    path: '',
    component: ComprasIndexComponent
  },
  {
    path: 'nuevo',
    component: ComprasNuevoComponent
  },
  {
    path: 'ver/:compra_id',
    component: ComprasVerComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ComprasRoutingModule { }
