import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { ReporteVentasSucursalRoutingModule } from './reporte-ventas-sucursal-routing.module';
import { ReporteVentasSucursalIndexComponent } from './reporte-ventas-sucursal-index/reporte-ventas-sucursal-index.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReporteVentasSucursalVerComponent } from './reporte-ventas-sucursal-ver/reporte-ventas-sucursal-ver.component';


@NgModule({
  declarations: [ReporteVentasSucursalIndexComponent, ReporteVentasSucursalVerComponent],
  imports: [CommonModule, ReporteVentasSucursalRoutingModule, SharedModule],
  providers: [DatePipe],
})
export class ReporteVentasSucursalModule {}
