import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoriasNuevoComponent } from './categorias-nuevo.component';

describe('CategoriasNuevoComponent', () => {
  let component: CategoriasNuevoComponent;
  let fixture: ComponentFixture<CategoriasNuevoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CategoriasNuevoComponent]
    });
    fixture = TestBed.createComponent(CategoriasNuevoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
