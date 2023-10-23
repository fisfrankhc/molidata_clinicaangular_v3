import { Component } from '@angular/core';
import { rutas } from 'src/app/shared/routes/rutas';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  public ruta = rutas;

  usuarionombre: any;
  constructor() {
    this.usuarionombre = localStorage.getItem('usernombre');
  }
  

}
