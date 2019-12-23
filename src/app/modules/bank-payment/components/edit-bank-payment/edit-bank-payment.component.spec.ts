import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditBankPaymentComponent } from './edit-bank-payment.component';

describe('EditBankPaymentComponent', () => {
  let component: EditBankPaymentComponent;
  let fixture: ComponentFixture<EditBankPaymentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditBankPaymentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditBankPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
