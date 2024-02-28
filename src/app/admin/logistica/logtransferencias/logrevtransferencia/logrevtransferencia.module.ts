import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LogrevtransferenciaRoutingModule } from './logrevtransferencia-routing.module';
import { LogrevtransferenciaIndexComponent } from './logrevtransferencia-index/logrevtransferencia-index.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { LogrevtransferenciaVerComponent } from './logrevtransferencia-ver/logrevtransferencia-ver.component';

@NgModule({
  declarations: [LogrevtransferenciaIndexComponent, LogrevtransferenciaVerComponent],
  imports: [CommonModule, LogrevtransferenciaRoutingModule, SharedModule],
})
export class LogrevtransferenciaModule {}
