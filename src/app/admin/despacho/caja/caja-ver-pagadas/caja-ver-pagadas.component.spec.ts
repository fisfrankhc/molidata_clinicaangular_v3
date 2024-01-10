import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CajaVerPagadasComponent } from './caja-ver-pagadas.component';

describe('CajaVerPagadasComponent', () => {
  let component: CajaVerPagadasComponent;
  let fixture: ComponentFixture<CajaVerPagadasComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CajaVerPagadasComponent]
    });
    fixture = TestBed.createComponent(CajaVerPagadasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
