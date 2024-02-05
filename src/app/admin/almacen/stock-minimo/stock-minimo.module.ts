import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StockMinimoRoutingModule } from './stock-minimo-routing.module';
import { StockMinimoIndexComponent } from './stock-minimo-index/stock-minimo-index.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [StockMinimoIndexComponent],
  imports: [CommonModule, StockMinimoRoutingModule, SharedModule],
})
export class StockMinimoModule {}
