import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferenciasNuevoComponent } from './transferencias-nuevo.component';

describe('TransferenciasNuevoComponent', () => {
  let component: TransferenciasNuevoComponent;
  let fixture: ComponentFixture<TransferenciasNuevoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TransferenciasNuevoComponent]
    });
    fixture = TestBed.createComponent(TransferenciasNuevoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
