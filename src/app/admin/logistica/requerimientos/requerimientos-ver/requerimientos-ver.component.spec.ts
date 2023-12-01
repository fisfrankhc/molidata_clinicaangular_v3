import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequerimientosVerComponent } from './requerimientos-ver.component';

describe('RequerimientosVerComponent', () => {
  let component: RequerimientosVerComponent;
  let fixture: ComponentFixture<RequerimientosVerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RequerimientosVerComponent]
    });
    fixture = TestBed.createComponent(RequerimientosVerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
