import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogrevtransferenciaIndexComponent } from './logrevtransferencia-index.component';

describe('LogrevtransferenciaIndexComponent', () => {
  let component: LogrevtransferenciaIndexComponent;
  let fixture: ComponentFixture<LogrevtransferenciaIndexComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LogrevtransferenciaIndexComponent]
    });
    fixture = TestBed.createComponent(LogrevtransferenciaIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
