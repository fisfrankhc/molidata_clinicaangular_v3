import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RVSPIndexComponent } from './r-v-s-p-index/r-v-s-p-index.component';
import { RVSPVerComponent } from './r-v-s-p-ver/r-v-s-p-ver.component';

const routes: Routes = [
  {
    path: '',
    component: RVSPIndexComponent
  },
  {
    path: 'ver/:sucursal_id/:fechainicio/:fechafin',
    component: RVSPVerComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RVSPagadasRoutingModule { }
