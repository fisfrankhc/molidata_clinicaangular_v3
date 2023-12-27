import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { ComprobanteNumeracion } from 'src/app/shared/interfaces/contable';
import { Observable } from 'rxjs';
import { UrlService } from '../../url.service';

@Injectable({
  providedIn: 'root',
})
export class ComprobanteNumeracionService {
  constructor(private urlService: UrlService, private http: HttpClient) {}
  private dominioUrl = this.urlService.dominio;
  private apiUrl = `${this.dominioUrl}/clinico/contable/numeracion.php`;

  getComprobanteNumeracionAll(): Observable<ComprobanteNumeracion> {
    return this.http.get<ComprobanteNumeracion>(`${this.apiUrl}`);
  }

  postComprobanteNumeracion(datos: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });
    const params = new HttpParams({ fromObject: datos });
    return this.http.post<any>(this.apiUrl, params.toString(), { headers });
  }

  getComprobanteNumeracion(id: number): Observable<ComprobanteNumeracion> {
    return this.http.get<ComprobanteNumeracion>(`${this.apiUrl}?id=${id}`);
  }

  updatedComprobanteNumeracion(datos: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.put(this.apiUrl, JSON.stringify(datos), { headers });
  }
}
