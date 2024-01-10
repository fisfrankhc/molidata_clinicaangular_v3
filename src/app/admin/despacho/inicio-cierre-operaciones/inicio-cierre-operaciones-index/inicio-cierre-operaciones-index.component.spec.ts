import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InicioCierreOperacionesIndexComponent } from './inicio-cierre-operaciones-index.component';

describe('InicioCierreOperacionesIndexComponent', () => {
  let component: InicioCierreOperacionesIndexComponent;
  let fixture: ComponentFixture<InicioCierreOperacionesIndexComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InicioCierreOperacionesIndexComponent]
    });
    fixture = TestBed.createComponent(InicioCierreOperacionesIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
