import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Movimientos } from 'src/app/shared/interfaces/almacen';
import { Observable } from 'rxjs';
import { UrlService } from '../../url.service';

@Injectable({
  providedIn: 'root',
})
export class MovimientosCentralService {
  constructor(private urlService: UrlService, private http: HttpClient) {}
  private dominioUrl = this.urlService.dominio;

  private apiUrl = `${this.dominioUrl}/clinico/logistica/movimientos-central.php`;
  getMovimientosCentralAll(): Observable<Movimientos> {
    return this.http.get<Movimientos>(`${this.apiUrl}`);
  }

  postMovimientosCentral(datos: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });
    const params = new HttpParams({ fromObject: datos });
    return this.http.post<any>(this.apiUrl, params.toString(), { headers });
  }

  getMovimientoCentral(id: number): Observable<Movimientos> {
    return this.http.get<Movimientos>(`${this.apiUrl}?id=${id}`);
  }

  updatedMovimientoCentral(datos: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.put(this.apiUrl, JSON.stringify(datos), { headers });
  }
}
