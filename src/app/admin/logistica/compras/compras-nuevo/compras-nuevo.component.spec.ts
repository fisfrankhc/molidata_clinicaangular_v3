import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComprasNuevoComponent } from './compras-nuevo.component';

describe('ComprasNuevoComponent', () => {
  let component: ComprasNuevoComponent;
  let fixture: ComponentFixture<ComprasNuevoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ComprasNuevoComponent],
    });
    fixture = TestBed.createComponent(ComprasNuevoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
