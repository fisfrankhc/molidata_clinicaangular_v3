import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsignacionSeriesEditarComponent } from './asignacion-series-editar.component';

describe('AsignacionSeriesEditarComponent', () => {
  let component: AsignacionSeriesEditarComponent;
  let fixture: ComponentFixture<AsignacionSeriesEditarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AsignacionSeriesEditarComponent]
    });
    fixture = TestBed.createComponent(AsignacionSeriesEditarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
