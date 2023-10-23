import { TestBed } from '@angular/core/testing';

import { OutloginService } from './outlogin.service';

describe('OutloginService', () => {
  let service: OutloginService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OutloginService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
