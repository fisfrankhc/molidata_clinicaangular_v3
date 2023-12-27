import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { AsignacionSeriesRoutingModule } from './asignacion-series-routing.module';
import { AsignacionSeriesIndexComponent } from './asignacion-series-index/asignacion-series-index.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { AsignacionSeriesNuevoComponent } from './asignacion-series-nuevo/asignacion-series-nuevo.component';
import { AsignacionSeriesEditarComponent } from './asignacion-series-editar/asignacion-series-editar.component';

@NgModule({
  declarations: [AsignacionSeriesIndexComponent, AsignacionSeriesNuevoComponent, AsignacionSeriesEditarComponent],
  imports: [CommonModule, AsignacionSeriesRoutingModule, SharedModule],
  providers: [DatePipe],
})
export class AsignacionSeriesModule {}
