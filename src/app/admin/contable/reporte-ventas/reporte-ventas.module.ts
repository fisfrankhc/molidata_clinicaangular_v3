import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { ReporteVentasRoutingModule } from './reporte-ventas-routing.module';
import { ReporteVentasIndexComponent } from './reporte-ventas-index/reporte-ventas-index.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MAT_DATE_LOCALE } from '@angular/material/core';

@NgModule({
  declarations: [ReporteVentasIndexComponent],
  imports: [CommonModule, ReporteVentasRoutingModule, SharedModule],
  providers: [DatePipe],
})
export class ReporteVentasModule {}
