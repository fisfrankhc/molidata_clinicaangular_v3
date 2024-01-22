import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsuariosRoutingModule } from './usuarios-routing.module';
import { UsuariosIndexComponent } from './usuarios-index/usuarios-index.component';
import { UsuariosEditarComponent } from './usuarios-editar/usuarios-editar.component';
import { UsuariosNuevoComponent } from './usuarios-nuevo/usuarios-nuevo.component';


@NgModule({
  declarations: [
    UsuariosIndexComponent,
    UsuariosEditarComponent,
    UsuariosNuevoComponent
  ],
  imports: [
    CommonModule,
    UsuariosRoutingModule
  ]
})
export class UsuariosModule { }
