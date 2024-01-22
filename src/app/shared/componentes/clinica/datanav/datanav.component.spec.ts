import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatanavComponent } from './datanav.component';

describe('DatanavComponent', () => {
  let component: DatanavComponent;
  let fixture: ComponentFixture<DatanavComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DatanavComponent]
    });
    fixture = TestBed.createComponent(DatanavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
