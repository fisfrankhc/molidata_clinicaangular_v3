import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SucursalRoutingModule } from './sucursal-routing.module';
import { SucursalIndexComponent } from './sucursal-index/sucursal-index.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { SucursalNuevoComponent } from './sucursal-nuevo/sucursal-nuevo.component';
import { SucursalEditarComponent } from './sucursal-editar/sucursal-editar.component';


@NgModule({
  declarations: [
    SucursalIndexComponent,
    SucursalNuevoComponent,
    SucursalEditarComponent
  ],
  imports: [
    CommonModule,
    SucursalRoutingModule,
    SharedModule,
  ]
})
export class SucursalModule { }
