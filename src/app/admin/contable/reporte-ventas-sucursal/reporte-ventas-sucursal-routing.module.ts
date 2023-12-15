import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RVSIndexComponent } from './r-v-s-index/r-v-s-index.component';

const routes: Routes = [
  {
    path: '',
    component: RVSIndexComponent,
  },
  {
    path: 'ventas-confirmadas',
    loadChildren: () =>
      import(
        './r-v-s-confirmadas/r-v-s-confirmadas.module'
      ).then((m) => m.RVSConfirmadasModule),
  },
  {
    path: 'ventas-pagadas',
    loadChildren: () =>
      import(
        './r-v-s-pagadas/r-v-s-pagadas.module'
      ).then((m) => m.RVSPagadasModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReporteVentasSucursalRoutingModule { }
