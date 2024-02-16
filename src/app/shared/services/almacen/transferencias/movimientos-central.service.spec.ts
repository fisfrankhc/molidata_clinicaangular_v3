import { TestBed } from '@angular/core/testing';

import { MovimientosCentralService } from './movimientos-central.service';

describe('MovimientosCentralService', () => {
  let service: MovimientosCentralService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MovimientosCentralService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
