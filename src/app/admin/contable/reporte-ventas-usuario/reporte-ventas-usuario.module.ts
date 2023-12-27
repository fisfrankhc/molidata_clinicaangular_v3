import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { ReporteVentasUsuarioRoutingModule } from './reporte-ventas-usuario-routing.module';
import { ReporteVentasUsuarioIndexComponent } from './reporte-ventas-usuario-index/reporte-ventas-usuario-index.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [ReporteVentasUsuarioIndexComponent],
  imports: [CommonModule, ReporteVentasUsuarioRoutingModule, SharedModule],
  providers: [DatePipe],
})
export class ReporteVentasUsuarioModule {}
