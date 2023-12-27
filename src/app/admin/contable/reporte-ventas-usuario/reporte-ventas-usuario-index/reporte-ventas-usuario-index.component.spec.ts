import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteVentasUsuarioIndexComponent } from './reporte-ventas-usuario-index.component';

describe('ReporteVentasUsuarioIndexComponent', () => {
  let component: ReporteVentasUsuarioIndexComponent;
  let fixture: ComponentFixture<ReporteVentasUsuarioIndexComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReporteVentasUsuarioIndexComponent]
    });
    fixture = TestBed.createComponent(ReporteVentasUsuarioIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
