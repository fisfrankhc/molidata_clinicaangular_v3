import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Comprobantes } from 'src/app/shared/interfaces/contable';
import { Observable } from 'rxjs';
import { UrlService } from '../../url.service';

@Injectable({
  providedIn: 'root',
})
export class ComprobantesService {
  constructor(private urlService: UrlService, private http: HttpClient) {}
  private dominioUrl = this.urlService.dominio;
  private apiUrl = `${this.dominioUrl}/clinico/contable/comprobantes.php`;

  getComprobantesAll(): Observable<Comprobantes> {
    return this.http.get<Comprobantes>(`${this.apiUrl}`);
  }

  getComprobante(id: number): Observable<Comprobantes> {
    return this.http.get<Comprobantes>(`${this.apiUrl}?id=${id}`);
  }

  postComprobante(datos: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });
    const params = new HttpParams({ fromObject: datos });
    return this.http.post<any>(this.apiUrl, params.toString(), { headers });
  }
}
