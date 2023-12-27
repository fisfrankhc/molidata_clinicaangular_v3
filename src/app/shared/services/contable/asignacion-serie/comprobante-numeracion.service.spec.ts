import { TestBed } from '@angular/core/testing';

import { ComprobanteNumeracionService } from './comprobante-numeracion.service';

describe('ComprobanteNumeracionService', () => {
  let service: ComprobanteNumeracionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ComprobanteNumeracionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
