import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UrlService } from '../../url.service';

@Injectable({
  providedIn: 'root',
})
export class ComprasDetalleService {
  constructor(private http: HttpClient, private urlService: UrlService) {}

  private dominioUrl = this.urlService.dominio;
  private apiUrl = `${this.dominioUrl}/clinico/logistica/compra-detalle.php`;

  private apiUrlReporte = `${this.dominioUrl}/clinico/logistica/compra-detalle-reporte.php`;

  getComprasDetalleAll(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}`);
  }

  postComprasDetalle(datos: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });
    const params = new HttpParams({ fromObject: datos });
    return this.http.post<any>(this.apiUrl, params.toString(), { headers });
  }

  getCompraDetalleReporte(
    proceso: string,
    estado: string,
    fechaInicio: string,
    fechaFinal: string
  ): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrlReporte}?proceso=${proceso}&estado=${estado}&fechaInicio=${fechaInicio}&fechaFinal=${fechaFinal}`
    );
  }
}
