import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsuariosRoutingModule } from './usuarios-routing.module';
import { UsuariosIndexComponent } from './usuarios-index/usuarios-index.component';
import { UsuariosNuevoComponent } from './usuarios-nuevo/usuarios-nuevo.component';
import { UsuariosEditarComponent } from './usuarios-editar/usuarios-editar.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [
    UsuariosIndexComponent,
    UsuariosNuevoComponent,
    UsuariosEditarComponent,
  ],
  imports: [CommonModule, UsuariosRoutingModule, SharedModule],
})
export class UsuariosModule {}
