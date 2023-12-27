import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { ReporteVentasSucursalRoutingModule } from './reporte-ventas-sucursal-routing.module';
import { RVSIndexComponent } from './r-v-s-index/r-v-s-index.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [RVSIndexComponent],
  imports: [CommonModule, ReporteVentasSucursalRoutingModule, SharedModule],
  providers: [DatePipe],
})
export class ReporteVentasSucursalModule {}
