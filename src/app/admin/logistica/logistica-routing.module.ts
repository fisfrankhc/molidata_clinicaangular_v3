import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from '../../auth/guard/auth.guard';

const routes: Routes = [
  {
    path: 'categoria',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./categorias/categorias.module').then((m) => m.CategoriasModule),
    data: { expectedRoles: ['1', '2'] } as any,
  },
  {
    path: 'compra',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./compras/compras.module').then((m) => m.ComprasModule),
    data: { expectedRoles: ['1', '2'] } as any,
  },
  {
    path: 'producto',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./productos/productos.module').then((m) => m.ProductosModule),
    data: { expectedRoles: ['1', '2'] } as any,
  },
  {
    path: 'proveedores',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./proveedores/proveedores.module').then(
        (m) => m.ProveedoresModule
      ),
    data: { expectedRoles: ['1', '2'] } as any,
  },
  {
    path: 'requerimientos',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./requerimientos/requerimientos.module').then(
        (m) => m.RequerimientosModule
      ),
    data: { expectedRoles: ['1', '2'] } as any,
  },
  /* {
    path: 'stock',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./stock/stock.module').then((m) => m.StockModule),
    data: { expectedRoles: ['1', '2'] } as any,
  }, */
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LogisticaRoutingModule {}
