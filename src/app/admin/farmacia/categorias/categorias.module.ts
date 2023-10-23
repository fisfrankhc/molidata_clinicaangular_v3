import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CategoriasRoutingModule } from './categorias-routing.module';
import { CategoriasIndexComponent } from './categorias-index/categorias-index.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { CategoriasNuevoComponent } from './categorias-nuevo/categorias-nuevo.component';

@NgModule({
  declarations: [CategoriasIndexComponent, CategoriasNuevoComponent],
  imports: [CommonModule, CategoriasRoutingModule, SharedModule],
})
export class CategoriasModule {}
