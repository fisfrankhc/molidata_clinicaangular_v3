import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReporteCajaIndexComponent } from './reporte-caja-index/reporte-caja-index.component';

const routes: Routes = [
  {
    path: '',
    component: ReporteCajaIndexComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReporteCajaRoutingModule { }
