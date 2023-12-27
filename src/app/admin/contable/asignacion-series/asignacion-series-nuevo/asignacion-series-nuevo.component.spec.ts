import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsignacionSeriesNuevoComponent } from './asignacion-series-nuevo.component';

describe('AsignacionSeriesNuevoComponent', () => {
  let component: AsignacionSeriesNuevoComponent;
  let fixture: ComponentFixture<AsignacionSeriesNuevoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AsignacionSeriesNuevoComponent]
    });
    fixture = TestBed.createComponent(AsignacionSeriesNuevoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
