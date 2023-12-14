import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { RVSPagadasRoutingModule } from './r-v-s-pagadas-routing.module';
import { RVSPIndexComponent } from './r-v-s-p-index/r-v-s-p-index.component';
import { RVSPVerComponent } from './r-v-s-p-ver/r-v-s-p-ver.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [RVSPIndexComponent, RVSPVerComponent],
  imports: [CommonModule, RVSPagadasRoutingModule, SharedModule],
  providers: [DatePipe],
})
export class RVSPagadasModule {}
