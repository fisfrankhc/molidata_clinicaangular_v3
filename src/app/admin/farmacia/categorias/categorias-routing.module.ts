import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoriasIndexComponent } from './categorias-index/categorias-index.component';
import { CategoriasNuevoComponent } from './categorias-nuevo/categorias-nuevo.component';

const routes: Routes = [
  {
    path: '',
    component: CategoriasIndexComponent,
  },
  {
    path: 'nuevo',
    component: CategoriasNuevoComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CategoriasRoutingModule { }
