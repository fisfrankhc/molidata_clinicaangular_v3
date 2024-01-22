import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsuariosEditarComponent } from './usuarios-editar.component';

describe('UsuariosEditarComponent', () => {
  let component: UsuariosEditarComponent;
  let fixture: ComponentFixture<UsuariosEditarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UsuariosEditarComponent]
    });
    fixture = TestBed.createComponent(UsuariosEditarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
