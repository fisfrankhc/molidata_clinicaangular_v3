import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StocksRoutingModule } from './stocks-routing.module';
import { StocksIndexComponent } from './stocks-index/stocks-index.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [StocksIndexComponent],
  imports: [CommonModule, StocksRoutingModule, SharedModule],
})
export class StocksModule {}
