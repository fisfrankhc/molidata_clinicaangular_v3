import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReporteCajaRoutingModule } from './reporte-caja-routing.module';
import { ReporteCajaIndexComponent } from './reporte-caja-index/reporte-caja-index.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    ReporteCajaIndexComponent
  ],
  imports: [
    CommonModule,
    ReporteCajaRoutingModule,
    SharedModule
  ]
})
export class ReporteCajaModule { }
