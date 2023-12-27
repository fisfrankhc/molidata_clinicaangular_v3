import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientesIndexComponent } from './clientes-index.component';

describe('ClientesIndexComponent', () => {
  let component: ClientesIndexComponent;
  let fixture: ComponentFixture<ClientesIndexComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ClientesIndexComponent]
    });
    fixture = TestBed.createComponent(ClientesIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
