import { TestBed } from '@angular/core/testing';

import { ComprobantesVentaService } from './comprobantes-venta.service';

describe('ComprobantesVentaService', () => {
  let service: ComprobantesVentaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ComprobantesVentaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
