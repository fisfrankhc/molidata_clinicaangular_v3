import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteCajaIndexComponent } from './reporte-caja-index.component';

describe('ReporteCajaIndexComponent', () => {
  let component: ReporteCajaIndexComponent;
  let fixture: ComponentFixture<ReporteCajaIndexComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReporteCajaIndexComponent]
    });
    fixture = TestBed.createComponent(ReporteCajaIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
