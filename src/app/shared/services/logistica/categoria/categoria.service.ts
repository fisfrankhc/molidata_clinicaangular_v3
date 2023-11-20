import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Categoria } from '../../../interfaces/logistica';
import { Observable } from 'rxjs';
import { UrlService } from '../../url.service';

@Injectable({
  providedIn: 'root',
})
export class CategoriaService {
  constructor(private http: HttpClient, private urlService: UrlService) {}

  private dominioUrl = this.urlService.dominio;
  private apiUrl = `${this.dominioUrl}/clinico/producto/categoria.php`;

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

  updatedCategoria(datos: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.put(this.apiUrl, JSON.stringify(datos), { headers });
  }
}
