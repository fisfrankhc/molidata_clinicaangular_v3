import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Producto } from '../../interfaces/farmacia';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductoService {
  private apiUrl = 'https://gifmigente.com/clinico/producto/producto.php';
  constructor(private http: HttpClient) {}

  getProductosAll(): Observable<Producto> {
    return this.http.get<Producto>(`${this.apiUrl}`);
  }
}
