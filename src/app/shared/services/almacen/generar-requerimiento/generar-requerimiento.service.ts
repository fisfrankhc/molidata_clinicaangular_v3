import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UrlService } from '../../url.service';

@Injectable({
  providedIn: 'root',
})
export class GenerarRequerimientoService {
  
  constructor(private urlService: UrlService, private http: HttpClient) {}
  private dominioUrl = this.urlService.dominio;

  private apiUrl = `${this.dominioUrl}/clinico/logistica/requerimiento.php`;
  getRequerimientosAll(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}`);
  }

  postRequerimientos(datos: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });
    const params = new HttpParams({ fromObject: datos });
    return this.http.post<any>(this.apiUrl, params.toString(), { headers });
  }

  getRequerimiento(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}?id=${id}`);
  }
}
