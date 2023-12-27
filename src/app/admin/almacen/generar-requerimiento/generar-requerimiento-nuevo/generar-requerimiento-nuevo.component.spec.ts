import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerarRequerimientoNuevoComponent } from './generar-requerimiento-nuevo.component';

describe('GenerarRequerimientoNuevoComponent', () => {
  let component: GenerarRequerimientoNuevoComponent;
  let fixture: ComponentFixture<GenerarRequerimientoNuevoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GenerarRequerimientoNuevoComponent]
    });
    fixture = TestBed.createComponent(GenerarRequerimientoNuevoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
