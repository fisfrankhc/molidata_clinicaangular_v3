import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'comprobantes',
    loadChildren: () =>
      import('./comprobantes/comprobantes.module').then(
        (m) => m.ComprobantesModule
      ),
  },
  {
    path: 'reporte-ventas-por-sucursal',
    loadChildren: () =>
      import('./reporte-ventas-sucursal/reporte-ventas-sucursal.module').then(
        (m) => m.ReporteVentasSucursalModule
      ),
  },
  {
    path: 'reporte-ventas-por-usuario',
    loadChildren: () =>
      import('./reporte-ventas-usuario/reporte-ventas-usuario.module').then(
        (m) => m.ReporteVentasUsuarioModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ContableRoutingModule {}
