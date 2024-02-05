import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { PacientesRoutingModule } from './pacientes-routing.module';
import { PacientesIndexComponent } from './pacientes-index/pacientes-index.component';
import { PacientesNuevoComponent } from './pacientes-nuevo/pacientes-nuevo.component';
import { PacientesEditarComponent } from './pacientes-editar/pacientes-editar.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [
    PacientesIndexComponent,
    PacientesNuevoComponent,
    PacientesEditarComponent,
  ],
  imports: [CommonModule, PacientesRoutingModule, SharedModule],
  providers: [DatePipe],
})
export class PacientesModule {}
