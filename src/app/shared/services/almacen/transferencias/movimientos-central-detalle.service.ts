import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Movimientos } from 'src/app/shared/interfaces/almacen';
import { Observable } from 'rxjs';
import { UrlService } from '../../url.service';

@Injectable({
  providedIn: 'root',
})
export class MovimientosCentralDetalleService {
  constructor(private urlService: UrlService, private http: HttpClient) {}
  private dominioUrl = this.urlService.dominio;

  private apiUrl = `${this.dominioUrl}/clinico/logistica/movimientos-central-detalle.php`;

  getMovimientosCentralDetalleAll(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}`);
  }

  postMovimientosCentralDetalle(datos: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });
    const params = new HttpParams({ fromObject: datos });
    return this.http.post<any>(this.apiUrl, params.toString(), { headers });
  }

  getMovimientoCentralDetalle(idDetalle: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}?id=${idDetalle}`);
  }
}
