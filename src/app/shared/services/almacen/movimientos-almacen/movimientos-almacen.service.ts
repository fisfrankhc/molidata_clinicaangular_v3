import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Movimientos } from 'src/app/shared/interfaces/almacen';
import { Observable } from 'rxjs';
import { UrlService } from '../../url.service';

@Injectable({
  providedIn: 'root',
})
export class MovimientosAlmacenService {
  constructor(private urlService: UrlService, private http: HttpClient) {}
  private dominioUrl = this.urlService.dominio;

  private apiUrl = `${this.dominioUrl}/clinico/logistica/movimiento.php`;
  private apiUrl2 = `${this.dominioUrl}/clinico/logistica/movimiento-codigo.php`;
  getMovimientosAll(): Observable<Movimientos> {
    return this.http.get<Movimientos>(`${this.apiUrl}`);
  }

  postMovimientos(datos: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });
    const params = new HttpParams({ fromObject: datos });
    return this.http.post<any>(this.apiUrl, params.toString(), { headers });
  }

  getMovimiento(id: number): Observable<Movimientos> {
    return this.http.get<Movimientos>(`${this.apiUrl}?id=${id}`);
  }

  updatedMovimiento(datos: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.put(this.apiUrl, JSON.stringify(datos), { headers });
  }

  getMovimientoCodigo(
    tipo: string,
    origen: string,
    codigo: string
  ): Observable<Movimientos> {
    return this.http.get<Movimientos>(
      `${this.apiUrl2}?tipo=${tipo}&origen=${origen}&codigo=${codigo}`
    );
  }
}
