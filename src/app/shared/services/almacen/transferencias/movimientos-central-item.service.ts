import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UrlService } from '../../url.service';

@Injectable({
  providedIn: 'root',
})
export class MovimientosCentralItemService {
  constructor(private http: HttpClient, private urlService: UrlService) {}

  private dominioUrl = this.urlService.dominio;
  private apiUrl = `${this.dominioUrl}/clinico/logistica/movimientos-central-item.php`;

  getMovimientosCentralItem(idMovimiento: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}?id=${idMovimiento}`);
  }
}
