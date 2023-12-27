import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Producto } from '../../../interfaces/logistica';
import { Observable } from 'rxjs';
import { UrlService } from '../../url.service';

@Injectable({
  providedIn: 'root',
})
export class ProductoService {
  constructor(private urlService: UrlService, private http: HttpClient) {}
  private dominioUrl = this.urlService.dominio;

  private apiUrl = `${this.dominioUrl}/clinico/producto/producto.php`;

  getProductosAll(): Observable<Producto> {
    return this.http.get<Producto>(`${this.apiUrl}`);
  }

  postProducto(datos: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });
    const params = new HttpParams({ fromObject: datos });
    return this.http.post<any>(this.apiUrl, params.toString(), { headers });
  }

  getProducto(id: number): Observable<Producto> {
    return this.http.get<Producto>(`${this.apiUrl}?id=${id}`);
  }

  updatedProducto(datos: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.put(this.apiUrl, JSON.stringify(datos), { headers });
  }

  /*
  uploadImage(image: File) {
    const formData = new FormData();
    formData.append('imagen', image);

    // Sube la imagen al directorio de imágenes
    //return this.http.post('assets/images/upload.php', formData); // Ejemplo de URL del servidor de copia
  }
  */
}
