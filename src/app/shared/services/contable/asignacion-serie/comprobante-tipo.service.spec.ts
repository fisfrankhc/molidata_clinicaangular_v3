import { TestBed } from '@angular/core/testing';

import { ComprobanteTipoService } from './comprobante-tipo.service';

describe('ComprobanteTipoService', () => {
  let service: ComprobanteTipoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ComprobanteTipoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
