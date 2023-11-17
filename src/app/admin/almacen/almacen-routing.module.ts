import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'stock-sucursal',
    loadChildren: () =>
      import('./stock-sucursal/stock-sucursal.module').then((m) => m.StockSucursalModule),
  },
    {
    path: 'movimientos-almacen',
    loadChildren: () =>
      import('./movimientos-almacen/movimientos-almacen.module').then((m) => m.MovimientosAlmacenModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AlmacenRoutingModule { }
