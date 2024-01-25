import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleNuevoComponent } from './role-nuevo.component';

describe('RoleNuevoComponent', () => {
  let component: RoleNuevoComponent;
  let fixture: ComponentFixture<RoleNuevoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RoleNuevoComponent]
    });
    fixture = TestBed.createComponent(RoleNuevoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
