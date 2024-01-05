import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { ComprobantesDetalles } from 'src/app/shared/interfaces/contable';
import { Observable } from 'rxjs';
import { UrlService } from '../../url.service';

@Injectable({
  providedIn: 'root',
})
export class ComprobantesItemsService {
  constructor(private urlService: UrlService, private http: HttpClient) {}
  private dominioUrl = this.urlService.dominio;
  private apiUrl = `${this.dominioUrl}/clinico/contable/comprobante_item.php`;

  getComprobanteDetalleItem(id: number): Observable<ComprobantesDetalles> {
    return this.http.get<ComprobantesDetalles>(`${this.apiUrl}?id=${id}`);
  }
}
