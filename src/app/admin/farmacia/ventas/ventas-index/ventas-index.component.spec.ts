import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VentasIndexComponent } from './ventas-index.component';

describe('VentasIndexComponent', () => {
  let component: VentasIndexComponent;
  let fixture: ComponentFixture<VentasIndexComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VentasIndexComponent]
    });
    fixture = TestBed.createComponent(VentasIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
