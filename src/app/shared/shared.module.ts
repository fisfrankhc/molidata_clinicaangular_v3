import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatSortModule } from '@angular/material/sort';
import { MaterialModule } from './material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgxBootstrapModule } from './ngx-bootstrap/ngx-bootstrap.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgxBootstrapModule,
    MatSortModule,
  ],
  exports: [
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    NgxBootstrapModule,
    MatSortModule,
  ],
})
export class SharedModule {}
