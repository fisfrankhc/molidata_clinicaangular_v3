import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Movimientos } from 'src/app/shared/interfaces/almacen';
import { Observable } from 'rxjs';
import { UrlService } from '../../url.service';

@Injectable({
  providedIn: 'root',
})
export class MovimientosAlmacenDetalleService {
  constructor(private urlService: UrlService, private http: HttpClient) {}
  private dominioUrl = this.urlService.dominio;

  private apiUrl = `${this.dominioUrl}/clinico/logistica/movimiento-detalle.php`;

  getMovimientosDetalleAll(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}`);
  }

  postMovimientosDetalle(datos: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });
    const params = new HttpParams({ fromObject: datos });
    return this.http.post<any>(this.apiUrl, params.toString(), { headers });
  }

  getMovimientosDetalle(idDetalle: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}?id=${idDetalle}`);
  }

  private apiUrl2 = `${this.dominioUrl}/clinico/logistica/stock.php`;
  updatedStock(datos: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.put(this.apiUrl2, JSON.stringify(datos), { headers });
  }
}

