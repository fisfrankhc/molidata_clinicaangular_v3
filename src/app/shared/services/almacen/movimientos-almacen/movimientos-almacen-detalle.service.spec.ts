import { TestBed } from '@angular/core/testing';

import { MovimientosAlmacenDetalleService } from './movimientos-almacen-detalle.service';

describe('MovimientosAlmacenDetalleService', () => {
  let service: MovimientosAlmacenDetalleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MovimientosAlmacenDetalleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
