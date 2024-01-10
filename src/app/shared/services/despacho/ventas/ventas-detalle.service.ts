import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UrlService } from 'src/app/shared/services/url.service';

@Injectable({
  providedIn: 'root',
})
export class VentasDetalleService {
  constructor(private http: HttpClient, private urlService: UrlService) {}

  private dominioUrl = this.urlService.dominio;
  private apiUrl = `${this.dominioUrl}/clinico/venta/venta-detalle.php`;
  private apiUrlReporte = `${this.dominioUrl}/clinico/venta/venta-detalle-reporte.php`;

  getVentasDetalleAll(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}`);
  }

  postVentasDetalle(datos: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });
    const params = new HttpParams({ fromObject: datos });
    return this.http.post<any>(this.apiUrl, params.toString(), { headers });
  }

  getVentaReporte(
    proceso: string,
    estado: string,
    sucursal: string,
    fechaInicio: string,
    fechaFinal: string
  ): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrlReporte}?proceso=${proceso}&estado=${estado}&sucursal=${sucursal}&fechaInicio=${fechaInicio}&fechaFinal=${fechaFinal}`
    );
  }
}
