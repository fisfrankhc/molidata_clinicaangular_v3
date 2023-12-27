import { TestBed } from '@angular/core/testing';

import { ComprasItemService } from './compras-item.service';

describe('ComprasItemService', () => {
  let service: ComprasItemService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ComprasItemService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
