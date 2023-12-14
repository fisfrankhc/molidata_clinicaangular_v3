import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { RVSConfirmadasRoutingModule } from './r-v-s-confirmadas-routing.module';
import { RVSCIndexComponent } from './r-v-s-c-index/r-v-s-c-index.component';
import { RVSCVerComponent } from './r-v-s-c-ver/r-v-s-c-ver.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [RVSCIndexComponent, RVSCVerComponent],
  imports: [CommonModule, RVSConfirmadasRoutingModule, SharedModule],
  providers: [DatePipe],
})
export class RVSConfirmadasModule {}
