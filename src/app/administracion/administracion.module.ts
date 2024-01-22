import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdministracionRoutingModule } from './administracion-routing.module';
import { SharedModule } from '../shared/shared.module';

import { AdministracionComponent } from './administracion.component';
import { HeaderadministracionComponent } from '../shared/componentes/administracion/headeradministracion/headeradministracion.component';
import { AdminnavComponent } from '../shared/componentes/administracion/adminnav/adminnav.component';

@NgModule({
  declarations: [
    AdministracionComponent,
    HeaderadministracionComponent,
    AdminnavComponent,
  ],
  imports: [CommonModule, AdministracionRoutingModule, SharedModule],
})
export class AdministracionModule {}
