import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OpeingBalanceComponent } from './opeing-balance.component';

describe('OpeingBalanceComponent', () => {
  let component: OpeingBalanceComponent;
  let fixture: ComponentFixture<OpeingBalanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OpeingBalanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpeingBalanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
