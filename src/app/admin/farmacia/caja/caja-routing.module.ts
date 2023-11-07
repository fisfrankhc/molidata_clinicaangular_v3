import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CajaIndexComponent } from './caja-index/caja-index.component';

const routes: Routes = [
  {
    path: '',
    component: CajaIndexComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CajaRoutingModule { }
