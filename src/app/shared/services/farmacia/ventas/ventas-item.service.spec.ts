import { TestBed } from '@angular/core/testing';

import { VentasItemService } from './ventas-item.service';

describe('VentasItemService', () => {
  let service: VentasItemService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VentasItemService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
