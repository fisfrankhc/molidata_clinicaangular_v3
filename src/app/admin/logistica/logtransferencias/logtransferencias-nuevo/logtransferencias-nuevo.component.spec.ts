import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogtransferenciasNuevoComponent } from './logtransferencias-nuevo.component';

describe('LogtransferenciasNuevoComponent', () => {
  let component: LogtransferenciasNuevoComponent;
  let fixture: ComponentFixture<LogtransferenciasNuevoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LogtransferenciasNuevoComponent]
    });
    fixture = TestBed.createComponent(LogtransferenciasNuevoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
