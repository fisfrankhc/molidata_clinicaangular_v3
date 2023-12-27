import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ComprobantesRoutingModule } from './comprobantes-routing.module';
import { ComprobantesIndexComponent } from './comprobantes-index/comprobantes-index.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    ComprobantesIndexComponent
  ],
  imports: [
    CommonModule,
    ComprobantesRoutingModule,
    SharedModule
  ]
})
export class ComprobantesModule { }
