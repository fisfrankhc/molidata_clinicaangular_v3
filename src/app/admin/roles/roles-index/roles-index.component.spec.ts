import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RolesIndexComponent } from './roles-index.component';

describe('RolesIndexComponent', () => {
  let component: RolesIndexComponent;
  let fixture: ComponentFixture<RolesIndexComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RolesIndexComponent]
    });
    fixture = TestBed.createComponent(RolesIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
