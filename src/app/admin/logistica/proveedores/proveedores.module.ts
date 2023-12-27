import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from 'src/app/shared/shared.module';

import { ProveedoresRoutingModule } from './proveedores-routing.module';
import { ProveedoresIndexComponent } from './proveedores-index/proveedores-index.component';
import { ProveedoresNuevoComponent } from './proveedores-nuevo/proveedores-nuevo.component';
import { ProveedoresEditarComponent } from './proveedores-editar/proveedores-editar.component';



@NgModule({
  declarations: [
    ProveedoresIndexComponent,
    ProveedoresNuevoComponent,
    ProveedoresEditarComponent
  ],
  imports: [
    CommonModule,
    ProveedoresRoutingModule,
    SharedModule
  ]
})
export class ProveedoresModule { }
