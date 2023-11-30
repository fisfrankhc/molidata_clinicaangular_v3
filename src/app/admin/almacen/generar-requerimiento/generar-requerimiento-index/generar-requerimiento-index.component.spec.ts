import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerarRequerimientoIndexComponent } from './generar-requerimiento-index.component';

describe('GenerarRequerimientoIndexComponent', () => {
  let component: GenerarRequerimientoIndexComponent;
  let fixture: ComponentFixture<GenerarRequerimientoIndexComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GenerarRequerimientoIndexComponent]
    });
    fixture = TestBed.createComponent(GenerarRequerimientoIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
