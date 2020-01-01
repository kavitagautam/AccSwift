import { TestBed } from "@angular/core/testing";

import { BankPaymentService } from "./bank-payment.service";

describe("BankPaymentService", () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it("should be created", () => {
    const service: BankPaymentService = TestBed.get(BankPaymentService);
    expect(service).toBeTruthy();
  });
});
