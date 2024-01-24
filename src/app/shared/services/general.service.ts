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

  ///PARA USUARIO
  getUsuariosAll(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl2}`);
  }

  getUsuario(id: any): Observable<any> {
    return this.http.get<any>(`${this.apiUrl2}?id=${id}`);
  }

  postUsuario(datos: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });
    const params = new HttpParams({ fromObject: datos });
    return this.http.post<any>(this.apiUrl2, params.toString(), { headers });
  }

  updatedUsuario(datos: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.put(this.apiUrl2, JSON.stringify(datos), { headers });
  }
}
