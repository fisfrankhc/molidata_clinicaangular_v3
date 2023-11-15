import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProveedoresIndexComponent } from './proveedores-index/proveedores-index.component';
import { ProveedoresNuevoComponent } from './proveedores-nuevo/proveedores-nuevo.component';
import { ProveedoresEditarComponent } from './proveedores-editar/proveedores-editar.component';

const routes: Routes = [
  {
    path: '',
    component: ProveedoresIndexComponent,
  },
  {
    path: 'nuevo',
    component: ProveedoresNuevoComponent,
  },
  {
    path: 'editar/:proveedor_id',
    component: ProveedoresEditarComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProveedoresRoutingModule { }
