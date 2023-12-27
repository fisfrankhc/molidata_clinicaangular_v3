import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteVentasIndexComponent } from './reporte-ventas-index.component';

describe('ReporteVentasIndexComponent', () => {
  let component: ReporteVentasIndexComponent;
  let fixture: ComponentFixture<ReporteVentasIndexComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReporteVentasIndexComponent]
    });
    fixture = TestBed.createComponent(ReporteVentasIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
