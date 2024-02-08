import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockCentralIndexComponent } from './stock-central-index.component';

describe('StockCentralIndexComponent', () => {
  let component: StockCentralIndexComponent;
  let fixture: ComponentFixture<StockCentralIndexComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StockCentralIndexComponent]
    });
    fixture = TestBed.createComponent(StockCentralIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
