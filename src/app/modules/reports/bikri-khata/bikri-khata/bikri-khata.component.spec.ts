import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BikriKhataComponent } from './bikri-khata.component';

describe('BikriKhataComponent', () => {
  let component: BikriKhataComponent;
  let fixture: ComponentFixture<BikriKhataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BikriKhataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BikriKhataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
