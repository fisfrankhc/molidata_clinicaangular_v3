import { Component } from '@angular/core';
import { rutas } from 'src/app/shared/routes/rutas';

@Component({
  selector: 'app-comprobantes-index',
  templateUrl: './comprobantes-index.component.html',
  styleUrls: ['./comprobantes-index.component.scss'],
})
export class ComprobantesIndexComponent {
  public ruta = rutas;
}
