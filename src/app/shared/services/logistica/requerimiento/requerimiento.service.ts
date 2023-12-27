import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UrlService } from '../../url.service';
@Injectable({
  providedIn: 'root',
})
export class RequerimientoService {
  constructor(private urlService: UrlService, private http: HttpClient) {}
  private dominioUrl = this.urlService.dominio;

  private apiUrl = `${this.dominioUrl}/clinico/logistica/requerimiento.php`;

  updateRequerimiento(datos: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.put(this.apiUrl, JSON.stringify(datos), { headers });
  }
}
