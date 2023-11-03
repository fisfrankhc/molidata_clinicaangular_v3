import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RolesIndexComponent } from './roles-index/roles-index.component';
import { RolesNuevoComponent } from './roles-nuevo/roles-nuevo.component';
import { RolesEditarComponent } from './roles-editar/roles-editar.component';

const routes: Routes = [
  {
    path: '',
    component: RolesIndexComponent,
  },
  {
    path: 'nuevo',
    component: RolesNuevoComponent,
  },
  {
    path: 'editar/:rol_id',
    component: RolesEditarComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RolesRoutingModule { }
