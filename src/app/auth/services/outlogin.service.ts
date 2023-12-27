import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class OutloginService {

  constructor(private router: Router) { }

  cerrarsesion() {
    localStorage.removeItem('userid');
    localStorage.removeItem('username');
    localStorage.removeItem('userrol');
    localStorage.removeItem('userestado');
    localStorage.removeItem('authenticated');
    this.router.navigate(['/login']);
  }

}
