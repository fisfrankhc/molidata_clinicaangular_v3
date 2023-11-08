import { NgModule } from '@angular/core';
import { AsyncPipe, CommonModule } from '@angular/common';

import { SharedModule } from 'src/app/shared/shared.module';
import { VentasRoutingModule } from './ventas-routing.module';
import { VentasIndexComponent } from './ventas-index/ventas-index.component';
import { VentasNuevoComponent } from './ventas-nuevo/ventas-nuevo.component';
import { DatePipe } from '@angular/common';
import { VentasVerComponent } from './ventas-ver/ventas-ver.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@NgModule({
  declarations: [
    VentasIndexComponent,
    VentasNuevoComponent,
    VentasVerComponent,
  ],
  imports: [
    CommonModule,
    VentasRoutingModule,
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
export class VentasModule {}
