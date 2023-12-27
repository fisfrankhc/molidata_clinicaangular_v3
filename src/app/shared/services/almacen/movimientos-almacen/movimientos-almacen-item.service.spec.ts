import { TestBed } from '@angular/core/testing';

import { MovimientosAlmacenItemService } from './movimientos-almacen-item.service';

describe('MovimientosAlmacenItemService', () => {
  let service: MovimientosAlmacenItemService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MovimientosAlmacenItemService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
