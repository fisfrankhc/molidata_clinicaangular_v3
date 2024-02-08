import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Comprobantes } from 'src/app/shared/interfaces/contable';
import { Observable } from 'rxjs';
import { UrlService } from '../../url.service';

@Injectable({
  providedIn: 'root',
})
export class ComprobantesVentaService {
  constructor(private urlService: UrlService, private http: HttpClient) {}
  private dominioUrl = this.urlService.dominio;
  private apiUrl = `${this.dominioUrl}/clinico/contable/comprobantes_venta.php`;

  getComprobanteVentaItem(id: number): Observable<Comprobantes> {
    return this.http.get<Comprobantes>(`${this.apiUrl}?id=${id}`);
  }
}
