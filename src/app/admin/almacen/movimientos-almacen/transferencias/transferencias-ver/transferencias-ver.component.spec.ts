import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferenciasVerComponent } from './transferencias-ver.component';

describe('TransferenciasVerComponent', () => {
  let component: TransferenciasVerComponent;
  let fixture: ComponentFixture<TransferenciasVerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TransferenciasVerComponent]
    });
    fixture = TestBed.createComponent(TransferenciasVerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
