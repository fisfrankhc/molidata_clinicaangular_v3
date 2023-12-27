import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from 'src/app/shared/shared.module';
import { ProductosRoutingModule } from './productos-routing.module';
import { ProductosIndexComponent } from './productos-index/productos-index.component';
import { ProductosNuevoComponent } from './productos-nuevo/productos-nuevo.component';
import { ProductosEditarComponent } from './productos-editar/productos-editar.component';


@NgModule({
  declarations: [ProductosIndexComponent, ProductosNuevoComponent, ProductosEditarComponent],
  imports: [CommonModule, ProductosRoutingModule, SharedModule],
})
export class ProductosModule {}
