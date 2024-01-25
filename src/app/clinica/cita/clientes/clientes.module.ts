import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { ClientesRoutingModule } from './clientes-routing.module';
import { ClientesIndexComponent } from './clientes-index/clientes-index.component';
import { ClientesNuevoComponent } from './clientes-nuevo/clientes-nuevo.component';
import { ClientesEditarComponent } from './clientes-editar/clientes-editar.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [
    ClientesIndexComponent,
    ClientesNuevoComponent,
    ClientesEditarComponent,
  ],
  imports: [CommonModule, ClientesRoutingModule, SharedModule],
  providers: [DatePipe],
})
export class ClientesModule {}
