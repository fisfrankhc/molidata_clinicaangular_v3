import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsuariosIndexComponent } from './usuarios-index/usuarios-index.component';
import { UsuariosNuevoComponent } from './usuarios-nuevo/usuarios-nuevo.component';
import { UsuariosEditarComponent } from './usuarios-editar/usuarios-editar.component';

const routes: Routes = [
  {
    path: '',
    component: UsuariosIndexComponent,
  },
  {
    path: 'nuevo',
    component: UsuariosNuevoComponent,
  },
  {
    path: 'editar/:usuario_id',
    component: UsuariosEditarComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsuariosRoutingModule {}
