import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VentasIndexComponent } from './ventas-index/ventas-index.component';

const routes: Routes = [
  {
    path: '',
    component: VentasIndexComponent,
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VentasRoutingModule { }
