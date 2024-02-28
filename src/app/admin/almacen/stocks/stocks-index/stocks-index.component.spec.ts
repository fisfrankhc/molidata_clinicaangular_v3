import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StocksIndexComponent } from './stocks-index.component';

describe('StocksIndexComponent', () => {
  let component: StocksIndexComponent;
  let fixture: ComponentFixture<StocksIndexComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StocksIndexComponent]
    });
    fixture = TestBed.createComponent(StocksIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
