import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RVSCVerComponent } from './r-v-s-c-ver.component';

describe('RVSCVerComponent', () => {
  let component: RVSCVerComponent;
  let fixture: ComponentFixture<RVSCVerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RVSCVerComponent]
    });
    fixture = TestBed.createComponent(RVSCVerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
