import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UrlService } from '../../url.service';
import { Ventas } from 'src/app/shared/interfaces/farmacia';

@Injectable({
  providedIn: 'root',
})
export class VentasConfirmadasService {
  constructor(private http: HttpClient, private urlService: UrlService) {}

  private dominioUrl = this.urlService.dominio;
  private apiUrl = `${this.dominioUrl}/clinico/venta/ventas-confirmadas.php`;

  getVentaConfirmada(id: number): Observable<Ventas> {
    return this.http.get<Ventas>(`${this.apiUrl}?sucursal=${id}`);
  }
}
