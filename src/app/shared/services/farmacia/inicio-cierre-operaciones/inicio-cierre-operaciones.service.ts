import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Proveedor } from 'src/app/shared/interfaces/logistica';
import { Observable } from 'rxjs';
import { UrlService } from '../../url.service';

@Injectable({
  providedIn: 'root',
})
export class InicioCierreOperacionesService {
  constructor(private urlService: UrlService, private http: HttpClient) {}
  private dominioUrl = this.urlService.dominio;

  private apiUrl = `${this.dominioUrl}/clinico/caja/caja-sesion.php`;

  getInicioCierreOperacionesAll(): Observable<Proveedor> {
    return this.http.get<Proveedor>(`${this.apiUrl}`);
  }

  postInicioCierreOperaciones(datos: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });
    const params = new HttpParams({ fromObject: datos });
    return this.http.post<any>(this.apiUrl, params.toString(), { headers });
  }

  getInicioCierreOperaciones(id: number): Observable<Proveedor> {
    return this.http.get<Proveedor>(`${this.apiUrl}?id=${id}`);
  }

  updatedInicioCierreOperaciones(datos: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.put(this.apiUrl, JSON.stringify(datos), { headers });
  }
}
