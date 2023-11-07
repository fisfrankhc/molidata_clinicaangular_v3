import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CajaRoutingModule } from './caja-routing.module';
import { CajaIndexComponent } from './caja-index/caja-index.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    CajaIndexComponent
  ],
  imports: [
    CommonModule,
    CajaRoutingModule,
    SharedModule
  ]
})
export class CajaModule { }
