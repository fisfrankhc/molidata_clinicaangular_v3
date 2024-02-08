import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { StockCentralRoutingModule } from './stock-central-routing.module';
import { StockCentralIndexComponent } from './stock-central-index/stock-central-index.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [StockCentralIndexComponent],
  imports: [CommonModule, StockCentralRoutingModule, SharedModule],
  providers: [DatePipe],
})
export class StockCentralModule {}
