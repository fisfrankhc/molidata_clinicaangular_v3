import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { RequerimientosRoutingModule } from './requerimientos-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { RequerimientosIndexComponent } from './requerimientos-index/requerimientos-index.component';
import { RequerimientosVerComponent } from './requerimientos-ver/requerimientos-ver.component';

@NgModule({
  declarations: [RequerimientosIndexComponent, RequerimientosVerComponent],
  imports: [CommonModule, RequerimientosRoutingModule, SharedModule],
  providers: [DatePipe],
})
export class RequerimientosModule {}
