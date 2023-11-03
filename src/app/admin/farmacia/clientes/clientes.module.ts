import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from 'src/app/shared/shared.module';
import { ClientesRoutingModule } from './clientes-routing.module';
import { ClientesIndexComponent } from './clientes-index/clientes-index.component';
import { ClientesNuevoComponent } from './clientes-nuevo/clientes-nuevo.component';
import { ClientesEditarComponent } from './clientes-editar/clientes-editar.component';


@NgModule({
  declarations: [ClientesIndexComponent, ClientesNuevoComponent, ClientesEditarComponent],
  imports: [CommonModule, ClientesRoutingModule, SharedModule],
})
export class ClientesModule {}
