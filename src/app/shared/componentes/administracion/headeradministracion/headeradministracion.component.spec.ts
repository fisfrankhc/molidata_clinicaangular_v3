import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderadministracionComponent } from './headeradministracion.component';

describe('HeaderadministracionComponent', () => {
  let component: HeaderadministracionComponent;
  let fixture: ComponentFixture<HeaderadministracionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HeaderadministracionComponent]
    });
    fixture = TestBed.createComponent(HeaderadministracionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
