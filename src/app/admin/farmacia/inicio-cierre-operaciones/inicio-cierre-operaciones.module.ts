import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InicioCierreOperacionesRoutingModule } from './inicio-cierre-operaciones-routing.module';
import { InicioCierreOperacionesIndexComponent } from './inicio-cierre-operaciones-index/inicio-cierre-operaciones-index.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    InicioCierreOperacionesIndexComponent
  ],
  imports: [
    CommonModule,
    InicioCierreOperacionesRoutingModule,
    SharedModule
  ]
})
export class InicioCierreOperacionesModule { }
