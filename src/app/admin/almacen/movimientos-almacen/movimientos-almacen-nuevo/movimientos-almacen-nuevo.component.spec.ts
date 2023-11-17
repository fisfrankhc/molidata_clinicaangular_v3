import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MovimientosAlmacenNuevoComponent } from './movimientos-almacen-nuevo.component';

describe('MovimientosAlmacenNuevoComponent', () => {
  let component: MovimientosAlmacenNuevoComponent;
  let fixture: ComponentFixture<MovimientosAlmacenNuevoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MovimientosAlmacenNuevoComponent]
    });
    fixture = TestBed.createComponent(MovimientosAlmacenNuevoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
