import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockSucursalIndexComponent } from './stock-sucursal-index.component';

describe('StockSucursalIndexComponent', () => {
  let component: StockSucursalIndexComponent;
  let fixture: ComponentFixture<StockSucursalIndexComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StockSucursalIndexComponent]
    });
    fixture = TestBed.createComponent(StockSucursalIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
