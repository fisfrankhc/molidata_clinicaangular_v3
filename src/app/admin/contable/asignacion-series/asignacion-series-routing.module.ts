import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AsignacionSeriesIndexComponent } from './asignacion-series-index/asignacion-series-index.component';
import { AsignacionSeriesNuevoComponent } from './asignacion-series-nuevo/asignacion-series-nuevo.component';
import { AsignacionSeriesEditarComponent } from './asignacion-series-editar/asignacion-series-editar.component';

const routes: Routes = [
  {
    path: '',
    component: AsignacionSeriesIndexComponent,
  },
  {
    path: 'nuevo',
    component: AsignacionSeriesNuevoComponent,
  },
  {
    path: 'editar/:comprobnumero_id',
    component: AsignacionSeriesEditarComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AsignacionSeriesRoutingModule {}
