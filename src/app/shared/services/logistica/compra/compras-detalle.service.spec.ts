import { TestBed } from '@angular/core/testing';

import { ComprasDetalleService } from './compras-detalle.service';

describe('ComprasDetalleService', () => {
  let service: ComprasDetalleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ComprasDetalleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
