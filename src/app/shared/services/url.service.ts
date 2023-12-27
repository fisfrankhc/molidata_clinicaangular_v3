import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UrlService {
  constructor() {}

  dominio: string = 'https://gifmigente.com';
}
