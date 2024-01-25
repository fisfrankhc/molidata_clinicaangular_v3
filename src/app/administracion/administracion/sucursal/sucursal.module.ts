import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SucursalRoutingModule } from './sucursal-routing.module';
import { SucursalIndexComponent } from './sucursal-index/sucursal-index.component';
import { SucursalEditarComponent } from './sucursal-editar/sucursal-editar.component';
import { SucursalNuevoComponent } from './sucursal-nuevo/sucursal-nuevo.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [
    SucursalIndexComponent,
    SucursalEditarComponent,
    SucursalNuevoComponent,
  ],
  imports: [CommonModule, SucursalRoutingModule, SharedModule],
})
export class SucursalModule {}
