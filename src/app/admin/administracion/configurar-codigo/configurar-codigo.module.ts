import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConfigurarCodigoRoutingModule } from './configurar-codigo-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { ConfigurarCodigoIndexComponent } from './configurar-codigo-index/configurar-codigo-index.component';


@NgModule({
  declarations: [ConfigurarCodigoIndexComponent],
  imports: [
    CommonModule,
    ConfigurarCodigoRoutingModule,
    SharedModule
  ]
})
export class ConfigurarCodigoModule { }
