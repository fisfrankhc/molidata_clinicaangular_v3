import { NgModule } from '@angular/core';
import { AsyncPipe, CommonModule } from '@angular/common';

import { ComprasRoutingModule } from './compras-routing.module';
import { ComprasIndexComponent } from './compras-index/compras-index.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ComprasNuevoComponent } from './compras-nuevo/compras-nuevo.component';

import { DatePipe } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ComprasVerComponent } from './compras-ver/compras-ver.component';

@NgModule({
  declarations: [
    ComprasIndexComponent,
    ComprasNuevoComponent,
    ComprasVerComponent,
  ],
  imports: [
    CommonModule,
    ComprasRoutingModule,
    SharedModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    MatSlideToggleModule,
    AsyncPipe,
  ],
  providers: [DatePipe],
})
export class ComprasModule {}
