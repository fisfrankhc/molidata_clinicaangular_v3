import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from 'src/app/shared/shared.module';
import { VentasRoutingModule } from './ventas-routing.module';
import { VentasIndexComponent } from './ventas-index/ventas-index.component';

@NgModule({
  declarations: [VentasIndexComponent],
  imports: [CommonModule, VentasRoutingModule, SharedModule],
})
export class VentasModule {}
