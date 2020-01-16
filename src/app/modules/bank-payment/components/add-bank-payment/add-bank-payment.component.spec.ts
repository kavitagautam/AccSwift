import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { AddBankPaymentComponent } from "./add-bank-payment.component";

describe("AddBankPaymentComponent", () => {
  let component: AddBankPaymentComponent;
  let fixture: ComponentFixture<AddBankPaymentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddBankPaymentComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddBankPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
