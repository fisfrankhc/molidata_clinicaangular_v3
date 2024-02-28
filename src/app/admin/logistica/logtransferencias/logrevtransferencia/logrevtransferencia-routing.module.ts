import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LogrevtransferenciaIndexComponent } from './logrevtransferencia-index/logrevtransferencia-index.component';
import { LogrevtransferenciaVerComponent } from './logrevtransferencia-ver/logrevtransferencia-ver.component';

const routes: Routes = [
  {
    path: '',
    component: LogrevtransferenciaIndexComponent,
  },
  {
    path: 'ver/:movimiento_id',
    component: LogrevtransferenciaVerComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LogrevtransferenciaRoutingModule {}
