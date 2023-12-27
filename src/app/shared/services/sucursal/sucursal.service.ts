import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Sucursal } from '../../interfaces/sucursal';
import { Observable } from 'rxjs';
import { UrlService } from '../url.service';

@Injectable({
  providedIn: 'root',
})
export class SucursalService {
  constructor(private urlService: UrlService, private http: HttpClient) {}
  private dominioUrl = this.urlService.dominio;
  private apiUrl = `${this.dominioUrl}/clinico/general/sucursal.php`;
  //private apiUrl = 'https://gifmigente.com/clinico/general/sucursal.php';

  getSucursalAll(): Observable<Sucursal> {
    return this.http.get<Sucursal>(`${this.apiUrl}`);
  }

  postSucursal(datos: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });
    const params = new HttpParams({ fromObject: datos });
    return this.http.post<any>(this.apiUrl, params.toString(), { headers });
  }

  getSucursal(id: number): Observable<Sucursal> {
    return this.http.get<Sucursal>(`${this.apiUrl}?id=${id}`);
  }

  updatedSucursal(datos: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.put(this.apiUrl, JSON.stringify(datos), { headers });
  }
}
