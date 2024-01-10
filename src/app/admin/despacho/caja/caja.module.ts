import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { CajaRoutingModule } from './caja-routing.module';
import { CajaIndexComponent } from './caja-index/caja-index.component';
import { CajaVerComponent } from './caja-ver/caja-ver.component';
import { CajaVerPagadasComponent } from './caja-ver-pagadas/caja-ver-pagadas.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [CajaIndexComponent, CajaVerComponent, CajaVerPagadasComponent],
  imports: [CommonModule, CajaRoutingModule, SharedModule],
  providers: [DatePipe],
})
export class CajaModule {}
