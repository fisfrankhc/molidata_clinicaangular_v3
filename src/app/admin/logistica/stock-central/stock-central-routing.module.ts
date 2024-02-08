import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StockCentralIndexComponent } from './stock-central-index/stock-central-index.component';

const routes: Routes = [
  {
    path: '',
    component: StockCentralIndexComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StockCentralRoutingModule {}
