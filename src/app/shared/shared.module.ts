import { NgModule } from '@angular/core';
import { AsyncPipe, CommonModule } from '@angular/common';

import { MatSortModule } from '@angular/material/sort';
import { MaterialModule } from './material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgxBootstrapModule } from './ngx-bootstrap/ngx-bootstrap.module';

import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
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
    MatAutocompleteModule,
  ],
  exports: [
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    NgxBootstrapModule,
    MatSortModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    AsyncPipe,
  ],
})
export class SharedModule {}
