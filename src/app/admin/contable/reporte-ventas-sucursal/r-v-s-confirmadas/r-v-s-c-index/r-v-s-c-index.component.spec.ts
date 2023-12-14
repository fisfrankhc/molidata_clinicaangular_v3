import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RVSCIndexComponent } from './r-v-s-c-index.component';

describe('RVSCIndexComponent', () => {
  let component: RVSCIndexComponent;
  let fixture: ComponentFixture<RVSCIndexComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RVSCIndexComponent]
    });
    fixture = TestBed.createComponent(RVSCIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
