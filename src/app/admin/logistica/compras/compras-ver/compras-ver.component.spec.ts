import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComprasVerComponent } from './compras-ver.component';

describe('ComprasVerComponent', () => {
  let component: ComprasVerComponent;
  let fixture: ComponentFixture<ComprasVerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ComprasVerComponent]
    });
    fixture = TestBed.createComponent(ComprasVerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
