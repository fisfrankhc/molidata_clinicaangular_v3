import { TestBed } from '@angular/core/testing';

import { ComprobantesItemsService } from './comprobantes-items.service';

describe('ComprobantesItemsService', () => {
  let service: ComprobantesItemsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ComprobantesItemsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
