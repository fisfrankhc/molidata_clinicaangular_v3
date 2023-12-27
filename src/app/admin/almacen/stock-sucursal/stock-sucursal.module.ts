import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StockSucursalRoutingModule } from './stock-sucursal-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { StockSucursalIndexComponent } from './stock-sucursal-index/stock-sucursal-index.component';


@NgModule({
  declarations: [
    StockSucursalIndexComponent
  ],
  imports: [
    CommonModule,
    StockSucursalRoutingModule,
    SharedModule
  ]
})
export class StockSucursalModule { }
