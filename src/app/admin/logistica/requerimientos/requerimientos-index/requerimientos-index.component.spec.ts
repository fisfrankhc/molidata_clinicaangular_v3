import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequerimientosIndexComponent } from './requerimientos-index.component';

describe('RequerimientosIndexComponent', () => {
  let component: RequerimientosIndexComponent;
  let fixture: ComponentFixture<RequerimientosIndexComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RequerimientosIndexComponent]
    });
    fixture = TestBed.createComponent(RequerimientosIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
