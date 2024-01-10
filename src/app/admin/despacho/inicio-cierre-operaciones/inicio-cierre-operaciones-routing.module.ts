import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InicioCierreOperacionesIndexComponent } from './inicio-cierre-operaciones-index/inicio-cierre-operaciones-index.component';

const routes: Routes = [
  {
    path: '',
    component: InicioCierreOperacionesIndexComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InicioCierreOperacionesRoutingModule { }
