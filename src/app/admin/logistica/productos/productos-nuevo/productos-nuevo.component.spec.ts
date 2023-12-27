import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductosNuevoComponent } from './productos-nuevo.component';

describe('ProductosNuevoComponent', () => {
  let component: ProductosNuevoComponent;
  let fixture: ComponentFixture<ProductosNuevoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProductosNuevoComponent]
    });
    fixture = TestBed.createComponent(ProductosNuevoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
