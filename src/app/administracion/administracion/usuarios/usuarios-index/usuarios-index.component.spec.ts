import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsuariosIndexComponent } from './usuarios-index.component';

describe('UsuariosIndexComponent', () => {
  let component: UsuariosIndexComponent;
  let fixture: ComponentFixture<UsuariosIndexComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UsuariosIndexComponent]
    });
    fixture = TestBed.createComponent(UsuariosIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
