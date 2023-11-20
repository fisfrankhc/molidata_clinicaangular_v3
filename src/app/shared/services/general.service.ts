import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UrlService } from './url.service';

@Injectable({
  providedIn: 'root',
})
export class GeneralService {
  constructor(private urlService: UrlService, private http: HttpClient) {}
  private dominioUrl = this.urlService.dominio;

  private apiUrl = `${this.dominioUrl}/clinico/empresa/empresa.php`;
  private apiUrl2 = `${this.dominioUrl}/clinico/general/usuario.php`;

  getDatosEmpresa(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}`);
  }

  getUsuariosAll(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl2}`);
  }
}
