import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UrlService } from './url.service';

@Injectable({
  providedIn: 'root',
})
export class EmailService {
  constructor(private urlService: UrlService, private http: HttpClient) {}
  private dominioUrl = this.urlService.dominio;

  private apiUrl = `${this.dominioUrl}/clinico/email/email.php`; // Reemplaza con la URL de tu servidor

  enviarEmail(formData: FormData): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'multipart/form-data',
    });

    return this.http.post(this.apiUrl, formData);
  }
}
