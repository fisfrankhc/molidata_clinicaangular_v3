import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RVSIndexComponent } from './r-v-s-index.component';

describe('RVSIndexComponent', () => {
  let component: RVSIndexComponent;
  let fixture: ComponentFixture<RVSIndexComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RVSIndexComponent]
    });
    fixture = TestBed.createComponent(RVSIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
