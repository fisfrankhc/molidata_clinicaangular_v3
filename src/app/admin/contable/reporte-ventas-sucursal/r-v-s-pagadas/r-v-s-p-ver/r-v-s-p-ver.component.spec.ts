import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RVSPVerComponent } from './r-v-s-p-ver.component';

describe('RVSPVerComponent', () => {
  let component: RVSPVerComponent;
  let fixture: ComponentFixture<RVSPVerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RVSPVerComponent]
    });
    fixture = TestBed.createComponent(RVSPVerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
