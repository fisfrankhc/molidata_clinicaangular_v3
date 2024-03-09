import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SalidasIndexComponent } from './salidas-index/salidas-index.component';
import { SalidasNuevoComponent } from './salidas-nuevo/salidas-nuevo.component';

const routes: Routes = [
  {
    path: '',
    component: SalidasIndexComponent,
  },
  {
    path: 'nuevo',
    component: SalidasNuevoComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SalidasRoutingModule {}
