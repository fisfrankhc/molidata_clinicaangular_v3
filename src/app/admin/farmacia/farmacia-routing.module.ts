import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'categoria',
    loadChildren: () =>
      import('./categorias/categorias.module').then((m) => m.CategoriasModule),
  },
  {
    path: 'producto',
    loadChildren: () =>
      import('./productos/productos.module').then((m) => m.ProductosModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FarmaciaRoutingModule {}
