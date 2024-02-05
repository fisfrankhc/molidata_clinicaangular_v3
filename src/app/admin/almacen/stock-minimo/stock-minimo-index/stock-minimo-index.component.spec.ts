import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockMinimoIndexComponent } from './stock-minimo-index.component';

describe('StockMinimoIndexComponent', () => {
  let component: StockMinimoIndexComponent;
  let fixture: ComponentFixture<StockMinimoIndexComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StockMinimoIndexComponent]
    });
    fixture = TestBed.createComponent(StockMinimoIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
