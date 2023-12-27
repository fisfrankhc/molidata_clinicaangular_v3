import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UrlService } from '../url.service';
import { Roles } from '../../interfaces/roles';

@Injectable({
  providedIn: 'root',
})
export class RolesService {
  constructor(private urlService: UrlService, private http: HttpClient) {}
  private dominioUrl = this.urlService.dominio;
  private apiUrl = `${this.dominioUrl}/clinico/general/rol.php`;

  getRolesAll(): Observable<Roles> {
    return this.http.get<Roles>(`${this.apiUrl}`);
  }

  postRoles(datos: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });
    const params = new HttpParams({ fromObject: datos });
    return this.http.post<any>(this.apiUrl, params.toString(), { headers });
  }

  getRol(id: number): Observable<Roles> {
    return this.http.get<Roles>(`${this.apiUrl}?id=${id}`);
  }

  updatedRol(datos: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.put(this.apiUrl, JSON.stringify(datos), { headers });
  }
}
