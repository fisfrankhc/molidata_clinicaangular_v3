import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SucursalIndexComponent } from './sucursal-index/sucursal-index.component';
import { SucursalNuevoComponent } from './sucursal-nuevo/sucursal-nuevo.component';
import { SucursalEditarComponent } from './sucursal-editar/sucursal-editar.component';

const routes: Routes = [
  {
    path: '',
    component: SucursalIndexComponent,
  },
  {
    path: 'nuevo',
    component: SucursalNuevoComponent,
  },
  {
    path: 'editar/:suc_id',
    component: SucursalEditarComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SucursalRoutingModule { }
