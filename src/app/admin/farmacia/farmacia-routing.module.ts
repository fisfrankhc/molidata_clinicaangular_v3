import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'venta',
    loadChildren: () =>
      import('./ventas/ventas.module').then((m) => m.VentasModule),
  },
  {
    path: 'cliente',
    loadChildren: () =>
      import('./clientes/clientes.module').then((m) => m.ClientesModule),
  },
  {
    path: 'caja',
    loadChildren: () => import('./caja/caja.module').then((m) => m.CajaModule),
  },
  {
    path: 'reportecaja',
    loadChildren: () =>
      import('./reporte-caja/reporte-caja.module').then(
        (m) => m.ReporteCajaModule
      ),
  },
  {
    path: 'inicio-cierre-operaciones',
    loadChildren: () =>
      import ('./inicio-cierre-operaciones/inicio-cierre-operaciones.module').then((m) => m.InicioCierreOperacionesModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FarmaciaRoutingModule {}
