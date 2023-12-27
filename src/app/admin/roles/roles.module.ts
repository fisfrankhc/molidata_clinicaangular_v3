import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RolesRoutingModule } from './roles-routing.module';
import { RolesIndexComponent } from './roles-index/roles-index.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { RolesNuevoComponent } from './roles-nuevo/roles-nuevo.component';
import { RolesEditarComponent } from './roles-editar/roles-editar.component';


@NgModule({
  declarations: [RolesIndexComponent, RolesNuevoComponent, RolesEditarComponent],
  imports: [CommonModule, RolesRoutingModule, SharedModule],
})
export class RolesModule {}
