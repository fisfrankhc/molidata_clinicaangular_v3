import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderclinicaComponent } from './headerclinica.component';

describe('HeaderclinicaComponent', () => {
  let component: HeaderclinicaComponent;
  let fixture: ComponentFixture<HeaderclinicaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HeaderclinicaComponent]
    });
    fixture = TestBed.createComponent(HeaderclinicaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
