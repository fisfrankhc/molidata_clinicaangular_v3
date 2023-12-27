import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from 'src/app/shared/shared.module';
import { CategoriasRoutingModule } from './categorias-routing.module';
import { CategoriasIndexComponent } from './categorias-index/categorias-index.component';
import { CategoriasNuevoComponent } from './categorias-nuevo/categorias-nuevo.component';
import { CategoriasEditarComponent } from './categorias-editar/categorias-editar.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [CategoriasIndexComponent, CategoriasNuevoComponent, CategoriasEditarComponent],
  imports: [CommonModule, CategoriasRoutingModule, SharedModule, FormsModule],
})
export class CategoriasModule {}
