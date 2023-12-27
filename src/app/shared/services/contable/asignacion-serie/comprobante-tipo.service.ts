import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { ComprobanteTipos } from 'src/app/shared/interfaces/contable';
import { Observable } from 'rxjs';
import { UrlService } from '../../url.service';

@Injectable({
  providedIn: 'root',
})
export class ComprobanteTipoService {
  constructor(private urlService: UrlService, private http: HttpClient) {}
  private dominioUrl = this.urlService.dominio;
  private apiUrl = `${this.dominioUrl}/clinico/contable/comprobante_tipos.php`;

  getComprobanteTiposAll(): Observable<ComprobanteTipos> {
    return this.http.get<ComprobanteTipos>(`${this.apiUrl}`);
  }
}
