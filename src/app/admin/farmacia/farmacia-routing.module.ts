import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from '../../auth/guard/auth.guard';

const routes: Routes = [
  {
    path: 'venta',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./ventas/ventas.module').then((m) => m.VentasModule),
    data: { expectedRoles: ['1', '2', '3', '4', '6'] } as any,
  },
  {
    path: 'cliente',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./clientes/clientes.module').then((m) => m.ClientesModule),
    data: { expectedRoles: ['1', '2', '3', '4', '6'] } as any,
  },
  {
    path: 'caja',
    canActivate: [authGuard],
    loadChildren: () => import('./caja/caja.module').then((m) => m.CajaModule),
    data: { expectedRoles: ['1', '2', '3', '4', '6'] } as any,
  },
  {
    path: 'reportecaja',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./reporte-caja/reporte-caja.module').then(
        (m) => m.ReporteCajaModule
      ),
    data: { expectedRoles: ['1', '2', '3', '4'] } as any,
  },
  {
    path: 'inicio-cierre-operaciones',
    canActivate: [authGuard],
    loadChildren: () =>
      import(
        './inicio-cierre-operaciones/inicio-cierre-operaciones.module'
      ).then((m) => m.InicioCierreOperacionesModule),
    data: { expectedRoles: ['1', '2', '3', '4', '6'] } as any,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FarmaciaRoutingModule {}
