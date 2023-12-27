import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { GenerarRequerimientoRoutingModule } from './generar-requerimiento-routing.module';
import { GenerarRequerimientoIndexComponent } from './generar-requerimiento-index/generar-requerimiento-index.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { GenerarRequerimientoNuevoComponent } from './generar-requerimiento-nuevo/generar-requerimiento-nuevo.component';
import { GenerarRequerimientoVerComponent } from './generar-requerimiento-ver/generar-requerimiento-ver.component';


@NgModule({
  declarations: [GenerarRequerimientoIndexComponent, GenerarRequerimientoNuevoComponent, GenerarRequerimientoVerComponent],
  imports: [CommonModule, GenerarRequerimientoRoutingModule, SharedModule],
  providers: [DatePipe],
})
export class GenerarRequerimientoModule {}
