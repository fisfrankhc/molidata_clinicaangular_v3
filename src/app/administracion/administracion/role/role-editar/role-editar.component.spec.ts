import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleEditarComponent } from './role-editar.component';

describe('RoleEditarComponent', () => {
  let component: RoleEditarComponent;
  let fixture: ComponentFixture<RoleEditarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RoleEditarComponent]
    });
    fixture = TestBed.createComponent(RoleEditarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
