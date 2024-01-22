import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClinicaRoutingModule } from './clinica-routing.module';
import { SharedModule } from '../shared/shared.module';

import { ClinicaComponent } from './clinica.component';
import { HeaderclinicaComponent } from '../shared/componentes/clinica/headerclinica/headerclinica.component';
import { DatanavComponent } from '../shared/componentes/clinica/datanav/datanav.component';

@NgModule({
  declarations: [ClinicaComponent, HeaderclinicaComponent, DatanavComponent],
  imports: [CommonModule, ClinicaRoutingModule, SharedModule],
})
export class ClinicaModule {}
