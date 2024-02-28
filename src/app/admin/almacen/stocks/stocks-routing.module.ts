import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StocksIndexComponent } from './stocks-index/stocks-index.component';

const routes: Routes = [
  {
    path: '',
    component: StocksIndexComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StocksRoutingModule {}
