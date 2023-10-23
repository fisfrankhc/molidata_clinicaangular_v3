import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductosIndexComponent } from './productos-index/productos-index.component';

const routes: Routes = [
  {
    path: '',
    component: ProductosIndexComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductosRoutingModule { }
