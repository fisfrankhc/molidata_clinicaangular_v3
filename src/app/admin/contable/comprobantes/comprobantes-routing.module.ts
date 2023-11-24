import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ComprobantesIndexComponent } from './comprobantes-index/comprobantes-index.component';

const routes: Routes = [
  {
    path: '',
    component: ComprobantesIndexComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ComprobantesRoutingModule { }
