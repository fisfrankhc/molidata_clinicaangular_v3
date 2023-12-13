import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReporteVentasSucursalIndexComponent } from './reporte-ventas-sucursal-index/reporte-ventas-sucursal-index.component';
import { ReporteVentasSucursalVerComponent } from './reporte-ventas-sucursal-ver/reporte-ventas-sucursal-ver.component';

const routes: Routes = [
  {
    path: '',
    component: ReporteVentasSucursalIndexComponent,
  },
  {
    path: 'ver/:sucursal_id/:fechainicio/:fechafin',
    component: ReporteVentasSucursalVerComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReporteVentasSucursalRoutingModule { }
