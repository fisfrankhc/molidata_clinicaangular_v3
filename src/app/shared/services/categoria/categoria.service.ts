import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Categoria } from '../../interfaces/farmacia';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CategoriaService {
  private apiUrl = 'https://gifmigente.com/clinico/producto/categoria.php';

  constructor(private http: HttpClient) {}

  getCategoriasAll(): Observable<Categoria> {
    return this.http.get<Categoria>(`${this.apiUrl}`);
  }

  postCategoria(data: any) {
    return this.http.post<any>(`${this.apiUrl}`, data);
  }
}
