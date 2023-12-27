import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockIndexComponent } from './stock-index.component';

describe('StockIndexComponent', () => {
  let component: StockIndexComponent;
  let fixture: ComponentFixture<StockIndexComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StockIndexComponent]
    });
    fixture = TestBed.createComponent(StockIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
