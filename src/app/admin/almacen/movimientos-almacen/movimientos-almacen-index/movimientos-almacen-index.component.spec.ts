import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MovimientosAlmacenIndexComponent } from './movimientos-almacen-index.component';

describe('MovimientosAlmacenIndexComponent', () => {
  let component: MovimientosAlmacenIndexComponent;
  let fixture: ComponentFixture<MovimientosAlmacenIndexComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MovimientosAlmacenIndexComponent]
    });
    fixture = TestBed.createComponent(MovimientosAlmacenIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
