import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoriasEditarComponent } from './categorias-editar.component';

describe('CategoriasEditarComponent', () => {
  let component: CategoriasEditarComponent;
  let fixture: ComponentFixture<CategoriasEditarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CategoriasEditarComponent]
    });
    fixture = TestBed.createComponent(CategoriasEditarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
