import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Pacientes } from 'src/app/shared/interfaces/clinica/cita';
import { Observable } from 'rxjs';
import { UrlService } from 'src/app/shared/services/url.service';

@Injectable({
  providedIn: 'root',
})
export class PacientesService {
  constructor(private urlService: UrlService, private http: HttpClient) {}

  private dominioUrl = this.urlService.dominio;
  private apiUrl = `${this.dominioUrl}/clinico/cita/paciente.php`;
  //private apiUrl = 'https://gifmigente.com/clinico/cliente/cliente.php';

  getPacientesAll(): Observable<Pacientes> {
    return this.http.get<Pacientes>(`${this.apiUrl}`);
  }

  postPacientes(datos: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });
    const params = new HttpParams({ fromObject: datos });
    return this.http.post<any>(this.apiUrl, params.toString(), { headers });
  }

  getPaciente(id: number): Observable<Pacientes> {
    return this.http.get<Pacientes>(`${this.apiUrl}?id=${id}`);
  }

  updatedPaciente(datos: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.put(this.apiUrl, JSON.stringify(datos), { headers });
  }
}
