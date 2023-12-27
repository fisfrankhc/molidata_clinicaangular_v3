import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StockRoutingModule } from './stock-routing.module';
import { StockIndexComponent } from './stock-index/stock-index.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    StockIndexComponent
  ],
  imports: [
    CommonModule,
    StockRoutingModule,
    SharedModule
  ]
})
export class StockModule { }
