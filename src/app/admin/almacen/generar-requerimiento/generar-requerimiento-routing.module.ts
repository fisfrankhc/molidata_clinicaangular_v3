import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GenerarRequerimientoIndexComponent } from './generar-requerimiento-index/generar-requerimiento-index.component';
import { GenerarRequerimientoNuevoComponent } from './generar-requerimiento-nuevo/generar-requerimiento-nuevo.component';

const routes: Routes = [
  {
    path: '',
    component: GenerarRequerimientoIndexComponent
  },
  {
    path: 'nuevo',
    component: GenerarRequerimientoNuevoComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GenerarRequerimientoRoutingModule { }
