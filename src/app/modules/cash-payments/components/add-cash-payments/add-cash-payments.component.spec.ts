import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCashPaymentsComponent } from './add-cash-payments.component';

describe('AddCashPaymentsComponent', () => {
  let component: AddCashPaymentsComponent;
  let fixture: ComponentFixture<AddCashPaymentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddCashPaymentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCashPaymentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
