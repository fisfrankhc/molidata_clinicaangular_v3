import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReporteVentasSucursalIndexComponent } from './reporte-ventas-sucursal-index/reporte-ventas-sucursal-index.component';

const routes: Routes = [
  {
    path: '',
    component: ReporteVentasSucursalIndexComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReporteVentasSucursalRoutingModule { }
