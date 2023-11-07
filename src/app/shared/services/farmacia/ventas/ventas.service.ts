import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Ventas } from 'src/app/shared/interfaces/farmacia';
import { Observable } from 'rxjs';
import { UrlService } from '../../url.service';

@Injectable({
  providedIn: 'root',
})
export class VentasService {
  constructor(private http: HttpClient, private urlService: UrlService) {}

  private dominioUrl = this.urlService.dominio;
  private apiUrl = `${this.dominioUrl}/clinico/venta/venta.php`;

  getVentasAll(): Observable<Ventas> {
    return this.http.get<Ventas>(`${this.apiUrl}`);
  }

  postVentas(datos: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });
    const params = new HttpParams({ fromObject: datos });
    return this.http.post<any>(this.apiUrl, params.toString(), { headers });
  }

  getVenta(id: number): Observable<Ventas> {
    return this.http.get<Ventas>(`${this.apiUrl}?id=${id}`);
  }

  updatedVenta(datos: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.put(this.apiUrl, JSON.stringify(datos), { headers });
  }
}
