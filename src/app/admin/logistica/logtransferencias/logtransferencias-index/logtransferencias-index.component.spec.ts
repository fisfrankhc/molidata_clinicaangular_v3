import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogtransferenciasIndexComponent } from './logtransferencias-index.component';

describe('LogtransferenciasIndexComponent', () => {
  let component: LogtransferenciasIndexComponent;
  let fixture: ComponentFixture<LogtransferenciasIndexComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LogtransferenciasIndexComponent]
    });
    fixture = TestBed.createComponent(LogtransferenciasIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
