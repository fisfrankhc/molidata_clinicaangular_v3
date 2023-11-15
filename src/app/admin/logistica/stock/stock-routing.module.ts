import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StockIndexComponent } from './stock-index/stock-index.component';

const routes: Routes = [
  {
    path: '',
    component: StockIndexComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StockRoutingModule { }
