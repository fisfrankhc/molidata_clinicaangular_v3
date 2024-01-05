import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { ComprobantesDetalles } from 'src/app/shared/interfaces/contable';
import { Observable } from 'rxjs';
import { UrlService } from '../../url.service';

@Injectable({
  providedIn: 'root',
})
export class ComprobantesDetalleService {
  constructor(private urlService: UrlService, private http: HttpClient) {}
  private dominioUrl = this.urlService.dominio;
  private apiUrl = `${this.dominioUrl}/clinico/contable/comprobante_detalles.php`;

  getComprobantesDetalleAll(): Observable<ComprobantesDetalles> {
    return this.http.get<ComprobantesDetalles>(`${this.apiUrl}`);
  }

  getComprobanteDetalle(id: number): Observable<ComprobantesDetalles> {
    return this.http.get<ComprobantesDetalles>(`${this.apiUrl}?id=${id}`);
  }

  postComprobanteDetalles(datos: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });
    const params = new HttpParams({ fromObject: datos });
    return this.http.post<any>(this.apiUrl, params.toString(), { headers });
  }
}
