import { TestBed } from '@angular/core/testing';

import { StockCentralService } from './stock-central.service';

describe('StockCentralService', () => {
  let service: StockCentralService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StockCentralService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
