import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReporteVentasIndexComponent } from './reporte-ventas-index/reporte-ventas-index.component';

const routes: Routes = [
  {
    path: '',
    component: ReporteVentasIndexComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReporteVentasRoutingModule { }
