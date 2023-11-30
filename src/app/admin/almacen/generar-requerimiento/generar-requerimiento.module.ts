import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { GenerarRequerimientoRoutingModule } from './generar-requerimiento-routing.module';
import { GenerarRequerimientoIndexComponent } from './generar-requerimiento-index/generar-requerimiento-index.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { GenerarRequerimientoNuevoComponent } from './generar-requerimiento-nuevo/generar-requerimiento-nuevo.component';


@NgModule({
  declarations: [GenerarRequerimientoIndexComponent, GenerarRequerimientoNuevoComponent],
  imports: [CommonModule, GenerarRequerimientoRoutingModule, SharedModule],
  providers: [DatePipe],
})
export class GenerarRequerimientoModule {}
