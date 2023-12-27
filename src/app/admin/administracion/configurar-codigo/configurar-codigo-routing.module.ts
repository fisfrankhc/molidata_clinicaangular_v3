import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConfigurarCodigoIndexComponent } from './configurar-codigo-index/configurar-codigo-index.component';

const routes: Routes = [
  {
    path: '',
    component: ConfigurarCodigoIndexComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConfigurarCodigoRoutingModule {}
