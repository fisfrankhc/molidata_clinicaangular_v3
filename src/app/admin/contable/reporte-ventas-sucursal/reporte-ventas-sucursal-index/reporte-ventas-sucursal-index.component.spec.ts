import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteVentasSucursalIndexComponent } from './reporte-ventas-sucursal-index.component';

describe('ReporteVentasSucursalIndexComponent', () => {
  let component: ReporteVentasSucursalIndexComponent;
  let fixture: ComponentFixture<ReporteVentasSucursalIndexComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReporteVentasSucursalIndexComponent]
    });
    fixture = TestBed.createComponent(ReporteVentasSucursalIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
