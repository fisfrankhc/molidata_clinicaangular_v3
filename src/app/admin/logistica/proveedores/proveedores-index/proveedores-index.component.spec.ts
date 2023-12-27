import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProveedoresIndexComponent } from './proveedores-index.component';

describe('ProveedoresIndexComponent', () => {
  let component: ProveedoresIndexComponent;
  let fixture: ComponentFixture<ProveedoresIndexComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProveedoresIndexComponent]
    });
    fixture = TestBed.createComponent(ProveedoresIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
