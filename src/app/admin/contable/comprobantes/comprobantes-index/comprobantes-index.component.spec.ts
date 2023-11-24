import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComprobantesIndexComponent } from './comprobantes-index.component';

describe('ComprobantesIndexComponent', () => {
  let component: ComprobantesIndexComponent;
  let fixture: ComponentFixture<ComprobantesIndexComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ComprobantesIndexComponent]
    });
    fixture = TestBed.createComponent(ComprobantesIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
