import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalidasIndexComponent } from './salidas-index.component';

describe('SalidasIndexComponent', () => {
  let component: SalidasIndexComponent;
  let fixture: ComponentFixture<SalidasIndexComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SalidasIndexComponent]
    });
    fixture = TestBed.createComponent(SalidasIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
