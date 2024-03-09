import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { SalidasRoutingModule } from './salidas-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { SalidasIndexComponent } from './salidas-index/salidas-index.component';
import { SalidasNuevoComponent } from './salidas-nuevo/salidas-nuevo.component';

@NgModule({
  declarations: [
    SalidasIndexComponent,
    SalidasNuevoComponent
  ],
  imports: [CommonModule, SalidasRoutingModule, SharedModule],
  providers: [DatePipe],
})
export class SalidasModule {}
