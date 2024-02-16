import { TestBed } from '@angular/core/testing';

import { MovimientosCentralDetalleService } from './movimientos-central-detalle.service';

describe('MovimientosCentralDetalleService', () => {
  let service: MovimientosCentralDetalleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MovimientosCentralDetalleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
