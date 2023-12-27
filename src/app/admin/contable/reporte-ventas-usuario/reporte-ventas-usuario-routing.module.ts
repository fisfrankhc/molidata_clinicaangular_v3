import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReporteVentasUsuarioIndexComponent } from './reporte-ventas-usuario-index/reporte-ventas-usuario-index.component';

const routes: Routes = [
  {
    path: '',
    component: ReporteVentasUsuarioIndexComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReporteVentasUsuarioRoutingModule { }
