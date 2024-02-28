import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogrevtransferenciaVerComponent } from './logrevtransferencia-ver.component';

describe('LogrevtransferenciaVerComponent', () => {
  let component: LogrevtransferenciaVerComponent;
  let fixture: ComponentFixture<LogrevtransferenciaVerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LogrevtransferenciaVerComponent]
    });
    fixture = TestBed.createComponent(LogrevtransferenciaVerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
