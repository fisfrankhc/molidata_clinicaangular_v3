import { TestBed } from '@angular/core/testing';

import { VentasDetalleService } from './ventas-detalle.service';

describe('VentasDetalleService', () => {
  let service: VentasDetalleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VentasDetalleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
