import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsuariosNuevoComponent } from './usuarios-nuevo.component';

describe('UsuariosNuevoComponent', () => {
  let component: UsuariosNuevoComponent;
  let fixture: ComponentFixture<UsuariosNuevoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UsuariosNuevoComponent]
    });
    fixture = TestBed.createComponent(UsuariosNuevoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
