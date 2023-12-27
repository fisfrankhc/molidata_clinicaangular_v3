import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RolesNuevoComponent } from './roles-nuevo.component';

describe('RolesNuevoComponent', () => {
  let component: RolesNuevoComponent;
  let fixture: ComponentFixture<RolesNuevoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RolesNuevoComponent]
    });
    fixture = TestBed.createComponent(RolesNuevoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
