import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Producto } from '../../../interfaces/logistica';
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

  /*   uploadImage(image: File) {
    const formData = new FormData();
    formData.append('imagen', image);

    // Sube la imagen al directorio de imágenes
    //return this.http.post('assets/images/upload.php', formData); // Ejemplo de URL del servidor de copia
  } */
}
