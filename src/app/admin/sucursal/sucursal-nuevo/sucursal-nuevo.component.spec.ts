import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SucursalNuevoComponent } from './sucursal-nuevo.component';

describe('SucursalNuevoComponent', () => {
  let component: SucursalNuevoComponent;
  let fixture: ComponentFixture<SucursalNuevoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SucursalNuevoComponent]
    });
    fixture = TestBed.createComponent(SucursalNuevoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
