import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleIndexComponent } from './role-index.component';

describe('RoleIndexComponent', () => {
  let component: RoleIndexComponent;
  let fixture: ComponentFixture<RoleIndexComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RoleIndexComponent]
    });
    fixture = TestBed.createComponent(RoleIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
