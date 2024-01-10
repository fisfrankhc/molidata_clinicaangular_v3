import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientesNuevoComponent } from './clientes-nuevo.component';

describe('ClientesNuevoComponent', () => {
  let component: ClientesNuevoComponent;
  let fixture: ComponentFixture<ClientesNuevoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ClientesNuevoComponent]
    });
    fixture = TestBed.createComponent(ClientesNuevoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
