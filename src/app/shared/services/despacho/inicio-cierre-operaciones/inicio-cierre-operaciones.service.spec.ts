import { TestBed } from '@angular/core/testing';

import { InicioCierreOperacionesService } from './inicio-cierre-operaciones.service';

describe('InicioCierreOperacionesService', () => {
  let service: InicioCierreOperacionesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InicioCierreOperacionesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
