import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListBankPaymentComponent } from './list-bank-payment.component';

describe('ListBankPaymentComponent', () => {
  let component: ListBankPaymentComponent;
  let fixture: ComponentFixture<ListBankPaymentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListBankPaymentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListBankPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
