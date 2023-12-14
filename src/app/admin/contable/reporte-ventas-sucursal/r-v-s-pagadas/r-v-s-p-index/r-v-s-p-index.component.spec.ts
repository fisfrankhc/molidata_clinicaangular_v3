import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RVSPIndexComponent } from './r-v-s-p-index.component';

describe('RVSPIndexComponent', () => {
  let component: RVSPIndexComponent;
  let fixture: ComponentFixture<RVSPIndexComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RVSPIndexComponent]
    });
    fixture = TestBed.createComponent(RVSPIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
