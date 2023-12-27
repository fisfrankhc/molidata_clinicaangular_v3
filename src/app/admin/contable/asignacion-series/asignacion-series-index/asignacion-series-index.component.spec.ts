import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsignacionSeriesIndexComponent } from './asignacion-series-index.component';

describe('AsignacionSeriesIndexComponent', () => {
  let component: AsignacionSeriesIndexComponent;
  let fixture: ComponentFixture<AsignacionSeriesIndexComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AsignacionSeriesIndexComponent]
    });
    fixture = TestBed.createComponent(AsignacionSeriesIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
