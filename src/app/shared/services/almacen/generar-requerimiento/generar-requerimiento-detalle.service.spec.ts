import { TestBed } from '@angular/core/testing';

import { GenerarRequerimientoDetalleService } from './generar-requerimiento-detalle.service';

describe('GenerarRequerimientoDetalleService', () => {
  let service: GenerarRequerimientoDetalleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GenerarRequerimientoDetalleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
