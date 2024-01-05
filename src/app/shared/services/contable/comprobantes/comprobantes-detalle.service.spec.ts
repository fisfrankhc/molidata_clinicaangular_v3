import { TestBed } from '@angular/core/testing';

import { ComprobantesDetalleService } from './comprobantes-detalle.service';

describe('ComprobantesDetalleService', () => {
  let service: ComprobantesDetalleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ComprobantesDetalleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
