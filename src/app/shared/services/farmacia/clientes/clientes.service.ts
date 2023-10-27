import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Clientes } from 'src/app/shared/interfaces/farmacia';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ClientesService {
  private apiUrl = 'https://gifmigente.com/clinico/cliente/cliente.php';
  constructor(private http: HttpClient) {}

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
}
