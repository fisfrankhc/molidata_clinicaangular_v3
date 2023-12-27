import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RequerimientosIndexComponent } from './requerimientos-index/requerimientos-index.component';
import { RequerimientosVerComponent } from './requerimientos-ver/requerimientos-ver.component';

const routes: Routes = [
  {
    path: '',
    component: RequerimientosIndexComponent,
  },
  {
    path: 'ver/:requerimiento_id',
    component: RequerimientosVerComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RequerimientosRoutingModule { }
