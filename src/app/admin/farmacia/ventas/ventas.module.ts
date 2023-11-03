import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from 'src/app/shared/shared.module';
import { VentasRoutingModule } from './ventas-routing.module';
import { VentasIndexComponent } from './ventas-index/ventas-index.component';
import { VentasNuevoComponent } from './ventas-nuevo/ventas-nuevo.component';

@NgModule({
  declarations: [VentasIndexComponent, VentasNuevoComponent],
  imports: [CommonModule, VentasRoutingModule, SharedModule],
})
export class VentasModule {}
