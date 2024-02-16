import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { TransferenciasRoutingModule } from './transferencias-routing.module';
import { TransferenciasIndexComponent } from './transferencias-index/transferencias-index.component';
import { TransferenciasNuevoComponent } from './transferencias-nuevo/transferencias-nuevo.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [TransferenciasIndexComponent, TransferenciasNuevoComponent],
  imports: [CommonModule, TransferenciasRoutingModule, SharedModule],
  providers: [DatePipe],
})
export class TransferenciasModule {}
