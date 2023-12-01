import { TestBed } from '@angular/core/testing';

import { GenerarRequerimientoItemService } from './generar-requerimiento-item.service';

describe('GenerarRequerimientoItemService', () => {
  let service: GenerarRequerimientoItemService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GenerarRequerimientoItemService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
