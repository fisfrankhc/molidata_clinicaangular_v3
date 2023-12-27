import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StockSucursalIndexComponent } from './stock-sucursal-index/stock-sucursal-index.component';

const routes: Routes = [
  {
    path: '',
    component: StockSucursalIndexComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StockSucursalRoutingModule { }
