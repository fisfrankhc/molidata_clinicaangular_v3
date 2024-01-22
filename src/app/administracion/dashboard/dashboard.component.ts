import { Component } from '@angular/core';
import { rutasadministracion } from 'src/app/shared/routes/rutasadministracion';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  public rutasadministracion = rutasadministracion;

  usuarionombre: any;
  constructor() {
    this.usuarionombre = localStorage.getItem('usernombre');
  }
}
