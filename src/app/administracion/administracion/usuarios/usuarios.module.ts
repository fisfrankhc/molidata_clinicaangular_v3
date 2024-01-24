import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { UsuariosRoutingModule } from './usuarios-routing.module';
import { UsuariosIndexComponent } from './usuarios-index/usuarios-index.component';
import { UsuariosEditarComponent } from './usuarios-editar/usuarios-editar.component';
import { UsuariosNuevoComponent } from './usuarios-nuevo/usuarios-nuevo.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [
    UsuariosIndexComponent,
    UsuariosEditarComponent,
    UsuariosNuevoComponent,
  ],
  imports: [CommonModule, UsuariosRoutingModule, SharedModule],
  providers: [DatePipe],
})
export class UsuariosModule {}
