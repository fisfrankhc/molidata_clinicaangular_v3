import { TestBed } from '@angular/core/testing';

import { GenerarRequerimientoService } from './generar-requerimiento.service';

describe('GenerarRequerimientoService', () => {
  let service: GenerarRequerimientoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GenerarRequerimientoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
