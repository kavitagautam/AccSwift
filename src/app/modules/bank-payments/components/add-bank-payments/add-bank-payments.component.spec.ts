import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBankPaymentsComponent } from './add-bank-payments.component';

describe('AddBankPaymentsComponent', () => {
  let component: AddBankPaymentsComponent;
  let fixture: ComponentFixture<AddBankPaymentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddBankPaymentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddBankPaymentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
