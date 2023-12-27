import { TestBed } from '@angular/core/testing';

import { MovimientosAlmacenService } from './movimientos-almacen.service';

describe('MovimientosAlmacenService', () => {
  let service: MovimientosAlmacenService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MovimientosAlmacenService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
