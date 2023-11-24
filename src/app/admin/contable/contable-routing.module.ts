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
    path: 'reporte-ventas',
    loadChildren: () =>
      import('./reporte-ventas/reporte-ventas.module').then(
        (m) => m.ReporteVentasModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ContableRoutingModule {}
