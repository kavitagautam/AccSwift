import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OprionsComponent } from './oprions.component';

describe('OprionsComponent', () => {
  let component: OprionsComponent;
  let fixture: ComponentFixture<OprionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OprionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OprionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
