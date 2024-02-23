import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { LogtransferenciasRoutingModule } from './logtransferencias-routing.module';
import { LogtransferenciasIndexComponent } from './logtransferencias-index/logtransferencias-index.component';
import { LogtransferenciasNuevoComponent } from './logtransferencias-nuevo/logtransferencias-nuevo.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [
    LogtransferenciasIndexComponent,
    LogtransferenciasNuevoComponent,
  ],
  imports: [CommonModule, LogtransferenciasRoutingModule, SharedModule],
  providers: [DatePipe],
})
export class LogtransferenciasModule {}
