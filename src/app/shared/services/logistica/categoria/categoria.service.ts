import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Categoria } from '../../../interfaces/logistica';
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

  postCategoria(datos: any) {
    /* const httpOptions = {
      headers: new HttpHeaders({
        //'Content-Type': 'application/json',JSON.stringify(datos)
        'Content-Type': 'application/x-www-form-urlencoded',
      }),
    }; */
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });

    // Convierte el objeto de datos en parámetros codificados
    const params = new HttpParams({ fromObject: datos });

    //return this.http.post<any>(this.apiUrl, datos, httpOptions);
    return this.http.post<any>(this.apiUrl, params.toString(), { headers });
  }
  getCategoria(id: number): Observable<Categoria> {
    return this.http.get<Categoria>(`${this.apiUrl}?id=${id}`);
  }
}
