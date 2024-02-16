import { TestBed } from '@angular/core/testing';

import { MovimientosCentralItemService } from './movimientos-central-item.service';

describe('MovimientosCentralItemService', () => {
  let service: MovimientosCentralItemService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MovimientosCentralItemService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
