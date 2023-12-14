import { Component } from '@angular/core';
import { rutas } from 'src/app/shared/routes/rutas';
@Component({
  selector: 'app-r-v-s-index',
  templateUrl: './r-v-s-index.component.html',
  styleUrls: ['./r-v-s-index.component.scss'],
})
export class RVSIndexComponent {
  public ruta = rutas;
}
