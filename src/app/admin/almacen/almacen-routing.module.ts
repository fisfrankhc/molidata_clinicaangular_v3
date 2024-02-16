import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from 'src/app/auth/guard/auth.guard';

const routes: Routes = [
  {
    path: 'stock-sucursal',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./stock-sucursal/stock-sucursal.module').then(
        (m) => m.StockSucursalModule
      ),
    data: { expectedRoles: ['1', '8'] } as any,
  },
  {
    path: 'movimientos-almacen',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./movimientos-almacen/movimientos-almacen.module').then(
        (m) => m.MovimientosAlmacenModule
      ),
    data: { expectedRoles: ['1', '8'] } as any,
  },
  {
    path: 'generar-requerimiento',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./generar-requerimiento/generar-requerimiento.module').then(
        (m) => m.GenerarRequerimientoModule
      ),
    data: { expectedRoles: ['1', '8'] } as any,
  },
  {
    path: 'stock-minimo',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./stock-minimo/stock-minimo.module').then(
        (m) => m.StockMinimoModule
      ),
    data: { expectedRoles: ['1', '5'] } as any,
  },
  {
    path: 'transferencias',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./transferencias/transferencias.module').then(
        (m) => m.TransferenciasModule
      ),
    data: { expectedRoles: ['1', '5'] } as any,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AlmacenRoutingModule {}
