import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigurarCodigoIndexComponent } from './configurar-codigo-index.component';

describe('ConfigurarCodigoIndexComponent', () => {
  let component: ConfigurarCodigoIndexComponent;
  let fixture: ComponentFixture<ConfigurarCodigoIndexComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConfigurarCodigoIndexComponent]
    });
    fixture = TestBed.createComponent(ConfigurarCodigoIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
