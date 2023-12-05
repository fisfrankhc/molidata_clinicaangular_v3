import { Component } from '@angular/core';
import { rutas } from 'src/app/shared/routes/rutas';

@Component({
  selector: 'app-inicio-cierre-operaciones-index',
  templateUrl: './inicio-cierre-operaciones-index.component.html',
  styleUrls: ['./inicio-cierre-operaciones-index.component.scss'],
})
export class InicioCierreOperacionesIndexComponent {
  public ruta = rutas;
}
