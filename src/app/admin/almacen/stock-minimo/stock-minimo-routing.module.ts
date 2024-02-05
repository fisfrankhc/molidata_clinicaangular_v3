import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StockMinimoIndexComponent } from './stock-minimo-index/stock-minimo-index.component';

const routes: Routes = [
  {
    path: '',
    component: StockMinimoIndexComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StockMinimoRoutingModule {}
