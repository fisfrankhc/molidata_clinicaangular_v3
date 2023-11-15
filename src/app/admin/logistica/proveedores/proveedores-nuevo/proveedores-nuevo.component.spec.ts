import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProveedoresNuevoComponent } from './proveedores-nuevo.component';

describe('ProveedoresNuevoComponent', () => {
  let component: ProveedoresNuevoComponent;
  let fixture: ComponentFixture<ProveedoresNuevoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProveedoresNuevoComponent]
    });
    fixture = TestBed.createComponent(ProveedoresNuevoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
