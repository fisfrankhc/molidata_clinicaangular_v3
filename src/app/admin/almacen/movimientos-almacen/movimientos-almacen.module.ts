import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { MovimientosAlmacenRoutingModule } from './movimientos-almacen-routing.module';
import { MovimientosAlmacenIndexComponent } from './movimientos-almacen-index/movimientos-almacen-index.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MovimientosAlmacenNuevoComponent } from './movimientos-almacen-nuevo/movimientos-almacen-nuevo.component';


@NgModule({
  declarations: [MovimientosAlmacenIndexComponent, MovimientosAlmacenNuevoComponent],
  imports: [CommonModule, MovimientosAlmacenRoutingModule, SharedModule],
  providers: [DatePipe],
})
export class MovimientosAlmacenModule {}
