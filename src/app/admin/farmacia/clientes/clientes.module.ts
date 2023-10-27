import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from 'src/app/shared/shared.module';
import { ClientesRoutingModule } from './clientes-routing.module';
import { ClientesIndexComponent } from './clientes-index/clientes-index.component';
import { ClientesNuevoComponent } from './clientes-nuevo/clientes-nuevo.component';


@NgModule({
  declarations: [ClientesIndexComponent, ClientesNuevoComponent],
  imports: [CommonModule, ClientesRoutingModule, SharedModule],
})
export class ClientesModule {}
