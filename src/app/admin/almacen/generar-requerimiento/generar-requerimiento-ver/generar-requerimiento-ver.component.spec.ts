import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerarRequerimientoVerComponent } from './generar-requerimiento-ver.component';

describe('GenerarRequerimientoVerComponent', () => {
  let component: GenerarRequerimientoVerComponent;
  let fixture: ComponentFixture<GenerarRequerimientoVerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GenerarRequerimientoVerComponent]
    });
    fixture = TestBed.createComponent(GenerarRequerimientoVerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
