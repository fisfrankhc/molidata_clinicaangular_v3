import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RVSCIndexComponent } from './r-v-s-c-index/r-v-s-c-index.component';
import { RVSCVerComponent } from './r-v-s-c-ver/r-v-s-c-ver.component';

const routes: Routes = [
  {
    path: '',
    component: RVSCIndexComponent
  },
  {
    path: 'ver/:sucursal_id/:fechainicio/:fechafin',
    component: RVSCVerComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RVSConfirmadasRoutingModule { }
