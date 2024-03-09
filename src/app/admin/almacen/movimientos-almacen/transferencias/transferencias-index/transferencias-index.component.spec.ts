import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferenciasIndexComponent } from './transferencias-index.component';

describe('TransferenciasIndexComponent', () => {
  let component: TransferenciasIndexComponent;
  let fixture: ComponentFixture<TransferenciasIndexComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TransferenciasIndexComponent]
    });
    fixture = TestBed.createComponent(TransferenciasIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
