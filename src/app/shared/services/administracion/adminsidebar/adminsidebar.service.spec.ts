import { TestBed } from '@angular/core/testing';

import { AdminsidebarService } from './adminsidebar.service';

describe('AdminsidebarService', () => {
  let service: AdminsidebarService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminsidebarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
