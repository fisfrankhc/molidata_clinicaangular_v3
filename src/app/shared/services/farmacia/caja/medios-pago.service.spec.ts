import { TestBed } from '@angular/core/testing';

import { MediosPagoService } from './medios-pago.service';

describe('MediosPagoService', () => {
  let service: MediosPagoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MediosPagoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
