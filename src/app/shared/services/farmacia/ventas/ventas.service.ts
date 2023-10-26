import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Ventas } from 'src/app/shared/interfaces/farmacia';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class VentasService {

  private apiUrl = '';
  constructor(private http: HttpClient) {}

  getVentasAll(): Observable<Ventas> {
    return this.http.get<Ventas>(`${this.apiUrl}`);
  }
}
