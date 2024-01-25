import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RoleRoutingModule } from './role-routing.module';
import { RoleIndexComponent } from './role-index/role-index.component';
import { RoleEditarComponent } from './role-editar/role-editar.component';
import { RoleNuevoComponent } from './role-nuevo/role-nuevo.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [RoleIndexComponent, RoleEditarComponent, RoleNuevoComponent],
  imports: [CommonModule, RoleRoutingModule, SharedModule],
})
export class RoleModule {}
