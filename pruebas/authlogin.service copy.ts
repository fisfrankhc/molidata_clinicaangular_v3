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

  public login(): void {
    this.router.navigate(['/dashboard']);
  }
}
