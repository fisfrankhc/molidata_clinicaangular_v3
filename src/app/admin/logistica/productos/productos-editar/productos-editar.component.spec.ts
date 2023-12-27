import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductosEditarComponent } from './productos-editar.component';

describe('ProductosEditarComponent', () => {
  let component: ProductosEditarComponent;
  let fixture: ComponentFixture<ProductosEditarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProductosEditarComponent]
    });
    fixture = TestBed.createComponent(ProductosEditarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
