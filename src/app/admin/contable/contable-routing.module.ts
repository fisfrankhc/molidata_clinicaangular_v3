import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from 'src/app/auth/guard/auth.guard';

const routes: Routes = [
  {
    path: 'comprobantes',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./comprobantes/comprobantes.module').then(
        (m) => m.ComprobantesModule
      ),
    data: { expectedRoles: ['1', '3'] } as any,
  },
  {
    path: 'reporte-ventas-por-sucursal',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./reporte-ventas-sucursal/reporte-ventas-sucursal.module').then(
        (m) => m.ReporteVentasSucursalModule
      ),
    data: { expectedRoles: ['1', '3'] } as any,
  },
  {
    path: 'reporte-ventas-por-usuario',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./reporte-ventas-usuario/reporte-ventas-usuario.module').then(
        (m) => m.ReporteVentasUsuarioModule
      ),
    data: { expectedRoles: ['1', '3'] } as any,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ContableRoutingModule {}
