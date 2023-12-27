import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VentasVerComponent } from './ventas-ver.component';

describe('VentasVerComponent', () => {
  let component: VentasVerComponent;
  let fixture: ComponentFixture<VentasVerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VentasVerComponent]
    });
    fixture = TestBed.createComponent(VentasVerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
