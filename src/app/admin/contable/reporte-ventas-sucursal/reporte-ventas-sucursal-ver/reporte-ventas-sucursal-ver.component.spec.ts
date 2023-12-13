import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteVentasSucursalVerComponent } from './reporte-ventas-sucursal-ver.component';

describe('ReporteVentasSucursalVerComponent', () => {
  let component: ReporteVentasSucursalVerComponent;
  let fixture: ComponentFixture<ReporteVentasSucursalVerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReporteVentasSucursalVerComponent]
    });
    fixture = TestBed.createComponent(ReporteVentasSucursalVerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
