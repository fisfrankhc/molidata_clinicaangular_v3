import { TestBed } from '@angular/core/testing';

import { VentasConfirmadasService } from './ventas-confirmadas.service';

describe('VentasConfirmadasService', () => {
  let service: VentasConfirmadasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VentasConfirmadasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
