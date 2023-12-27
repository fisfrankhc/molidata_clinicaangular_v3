import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Clientes } from 'src/app/shared/interfaces/farmacia';
import { Observable } from 'rxjs';
import { UrlService } from '../../url.service';

@Injectable({
  providedIn: 'root',
})
export class ClientesService {
  constructor(private urlService: UrlService, private http: HttpClient) {}

  private dominioUrl = this.urlService.dominio;
  private apiUrl = `${this.dominioUrl}/clinico/cliente/cliente.php`;
  //private apiUrl = 'https://gifmigente.com/clinico/cliente/cliente.php';

  getClientesAll(): Observable<Clientes> {
    return this.http.get<Clientes>(`${this.apiUrl}`);
  }

  postClientes(datos: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });
    const params = new HttpParams({ fromObject: datos });
    return this.http.post<any>(this.apiUrl, params.toString(), { headers });
  }

  getCliente(id: number): Observable<Clientes> {
    return this.http.get<Clientes>(`${this.apiUrl}?id=${id}`);
  }

  updatedCliente(datos: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.put(this.apiUrl, JSON.stringify(datos), { headers });
  }
}
