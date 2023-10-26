import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from 'src/app/shared/shared.module';
import { ProductosRoutingModule } from './productos-routing.module';
import { ProductosIndexComponent } from './productos-index/productos-index.component';
import { ProductosNuevoComponent } from './productos-nuevo/productos-nuevo.component';


@NgModule({
  declarations: [ProductosIndexComponent, ProductosNuevoComponent],
  imports: [CommonModule, ProductosRoutingModule, SharedModule],
})
export class ProductosModule {}
