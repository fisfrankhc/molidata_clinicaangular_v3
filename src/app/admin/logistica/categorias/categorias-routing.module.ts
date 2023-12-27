import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoriasIndexComponent } from './categorias-index/categorias-index.component';
import { CategoriasNuevoComponent } from './categorias-nuevo/categorias-nuevo.component';
import { CategoriasEditarComponent } from './categorias-editar/categorias-editar.component';

const routes: Routes = [
  {
    path: '',
    component: CategoriasIndexComponent,
  },
  {
    path: 'nuevo',
    component: CategoriasNuevoComponent,
  },
  {
    path: 'editar/:cat_id',
    component: CategoriasEditarComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CategoriasRoutingModule { }
