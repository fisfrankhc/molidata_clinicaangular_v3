import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Medida } from 'src/app/shared/interfaces/logistica';
import { UrlService } from '../../url.service';
@Injectable({
  providedIn: 'root',
})
export class MedidaService {
  constructor(private urlService: UrlService, private http: HttpClient) {}
  private dominioUrl = this.urlService.dominio;

  private apiUrl = `${this.dominioUrl}/clinico/producto/medida.php`;

  getMedidasAll(): Observable<Medida> {
    return this.http.get<Medida>(`${this.apiUrl}`);
  }

  getMedida(id: number): Observable<Medida> {
    return this.http.get<Medida>(`${this.apiUrl}?id=${id}`);
  }
}
