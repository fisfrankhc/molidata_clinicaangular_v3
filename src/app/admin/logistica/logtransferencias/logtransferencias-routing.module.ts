import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LogtransferenciasIndexComponent } from './logtransferencias-index/logtransferencias-index.component';
import { LogtransferenciasNuevoComponent } from './logtransferencias-nuevo/logtransferencias-nuevo.component';

const routes: Routes = [
  {
    path: '',
    component: LogtransferenciasIndexComponent,
  },
  {
    path: 'nuevo',
    component: LogtransferenciasNuevoComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LogtransferenciasRoutingModule {}
