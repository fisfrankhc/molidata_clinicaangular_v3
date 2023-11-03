import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VentasIndexComponent } from './ventas-index/ventas-index.component';
import { VentasNuevoComponent } from './ventas-nuevo/ventas-nuevo.component';

const routes: Routes = [
  {
    path: '',
    component: VentasIndexComponent,
  },
  {
    path: 'nuevo',
    component: VentasNuevoComponent
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VentasRoutingModule { }
