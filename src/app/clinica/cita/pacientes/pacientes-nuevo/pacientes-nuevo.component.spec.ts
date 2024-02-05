import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PacientesNuevoComponent } from './pacientes-nuevo.component';

describe('PacientesNuevoComponent', () => {
  let component: PacientesNuevoComponent;
  let fixture: ComponentFixture<PacientesNuevoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PacientesNuevoComponent]
    });
    fixture = TestBed.createComponent(PacientesNuevoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
