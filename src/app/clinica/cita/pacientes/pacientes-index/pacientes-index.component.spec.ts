import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PacientesIndexComponent } from './pacientes-index.component';

describe('PacientesIndexComponent', () => {
  let component: PacientesIndexComponent;
  let fixture: ComponentFixture<PacientesIndexComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PacientesIndexComponent]
    });
    fixture = TestBed.createComponent(PacientesIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
