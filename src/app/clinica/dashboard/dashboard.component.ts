import { Component } from '@angular/core';
import { rutasclinica } from 'src/app/shared/routes/rutasclinica';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  public rutasclinica = rutasclinica;

  usuarionombre: any;
  constructor() {
    this.usuarionombre = localStorage.getItem('usernombre');
  }
}
