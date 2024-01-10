import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UrlService } from 'src/app/shared/services/url.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MediosPagoService {
  constructor(private urlService: UrlService, private http: HttpClient) {}
  private dominioUrl = this.urlService.dominio;

  private apiUrl = `${this.dominioUrl}/clinico/caja/medios-pago.php`;

  getMediosPagoAll(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}`);
  }
}
