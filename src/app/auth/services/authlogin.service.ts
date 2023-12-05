import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from 'src/app/shared/interfaces/user';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthloginService {
  private apiUrl = 'https://gifmigente.com/clinico/general/usuario-name.php';

  constructor(private http: HttpClient, private router: Router) {}

  getUserData(user_name: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}?name=${user_name}`);
  }

  public loginexitoso(
    id: string,
    username: string,
    nombre: string,
    correo: string,
    rol: string,
    sucursal: string,
    estado: string
  ) {
    localStorage.setItem('userid', id);
    localStorage.setItem('username', username);
    localStorage.setItem('usernombre', nombre);
    localStorage.setItem('usercorreo', correo);
    localStorage.setItem('userrol', rol);
    localStorage.setItem('usersucursal', sucursal);
    localStorage.setItem('userestado', estado);
    localStorage.setItem('authenticated', 'true');
    this.router.navigate(['/dashboard']);
    console.log(id);
    console.log(username);
    console.log(nombre);
    console.log(correo);
    console.log(rol);
    console.log(sucursal);
    console.log(estado);
  }

  getRole(): string | null {
    return localStorage.getItem('userrol');
  }
}
