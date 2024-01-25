import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoleIndexComponent } from './role-index/role-index.component';
import { RoleNuevoComponent } from './role-nuevo/role-nuevo.component';
import { RoleEditarComponent } from './role-editar/role-editar.component';

const routes: Routes = [
  {
    path: '',
    component: RoleIndexComponent,
  },
  {
    path: 'nuevo',
    component: RoleNuevoComponent,
  },
  {
    path: 'editar/:rol_id',
    component: RoleEditarComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RoleRoutingModule {}
