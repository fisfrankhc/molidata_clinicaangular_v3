import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductosIndexComponent } from './productos-index/productos-index.component';
import { ProductosNuevoComponent } from './productos-nuevo/productos-nuevo.component';
import { ProductosEditarComponent } from './productos-editar/productos-editar.component';

const routes: Routes = [
  {
    path: '',
    component: ProductosIndexComponent,
  },
  {
    path: 'nuevo',
    component: ProductosNuevoComponent,
  },
  {
    path: 'editar/:prod_id',
    component: ProductosEditarComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductosRoutingModule { }
