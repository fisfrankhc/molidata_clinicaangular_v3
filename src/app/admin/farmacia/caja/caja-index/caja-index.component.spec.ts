import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CajaIndexComponent } from './caja-index.component';

describe('CajaIndexComponent', () => {
  let component: CajaIndexComponent;
  let fixture: ComponentFixture<CajaIndexComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CajaIndexComponent]
    });
    fixture = TestBed.createComponent(CajaIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
