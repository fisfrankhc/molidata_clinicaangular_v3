import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VentasNuevoComponent } from './ventas-nuevo.component';

describe('VentasNuevoComponent', () => {
  let component: VentasNuevoComponent;
  let fixture: ComponentFixture<VentasNuevoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VentasNuevoComponent],
    });
    fixture = TestBed.createComponent(VentasNuevoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
