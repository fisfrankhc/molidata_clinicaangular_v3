import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClientesRoutingModule } from './clientes-routing.module';
import { ClientesEditarComponent } from './clientes-editar/clientes-editar.component';
import { ClientesIndexComponent } from './clientes-index/clientes-index.component';
import { ClientesNuevoComponent } from './clientes-nuevo/clientes-nuevo.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    ClientesEditarComponent,
    ClientesIndexComponent,
    ClientesNuevoComponent,
  ],
  imports: [CommonModule, ClientesRoutingModule, SharedModule],
})
export class ClientesModule {}
