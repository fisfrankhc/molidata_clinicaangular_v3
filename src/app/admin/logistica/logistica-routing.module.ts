import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'categoria',
    loadChildren: () =>
      import('./categorias/categorias.module').then((m) => m.CategoriasModule),
  },
  {
    path: 'compra',
    loadChildren: () =>
      import('./compras/compras.module').then((m) => m.ComprasModule),
  },
  {
    path: 'producto',
    loadChildren: () =>
      import('./productos/productos.module').then((m) => m.ProductosModule),
  },
  {
    path: 'proveedores',
    loadChildren: () =>
      import('./proveedores/proveedores.module').then(
        (m) => m.ProveedoresModule
      ),
  },
  {
    path: 'stock',
    loadChildren: () =>
      import('./stock/stock.module').then(
        (m) => m.StockModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LogisticaRoutingModule {}
