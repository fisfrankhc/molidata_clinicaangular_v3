import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComprasIndexComponent } from './compras-index.component';

describe('ComprasIndexComponent', () => {
  let component: ComprasIndexComponent;
  let fixture: ComponentFixture<ComprasIndexComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ComprasIndexComponent]
    });
    fixture = TestBed.createComponent(ComprasIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
