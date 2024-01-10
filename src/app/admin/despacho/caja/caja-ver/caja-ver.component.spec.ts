import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CajaVerComponent } from './caja-ver.component';

describe('CajaVerComponent', () => {
  let component: CajaVerComponent;
  let fixture: ComponentFixture<CajaVerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CajaVerComponent]
    });
    fixture = TestBed.createComponent(CajaVerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
