import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RolesEditarComponent } from './roles-editar.component';

describe('RolesEditarComponent', () => {
  let component: RolesEditarComponent;
  let fixture: ComponentFixture<RolesEditarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RolesEditarComponent]
    });
    fixture = TestBed.createComponent(RolesEditarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
