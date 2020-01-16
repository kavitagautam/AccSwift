import { TestBed } from "@angular/core/testing";

import { BankReceiptService } from "./bank-receipt.service";

describe("BankReceiptService", () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it("should be created", () => {
    const service: BankReceiptService = TestBed.get(BankReceiptService);
    expect(service).toBeTruthy();
  });
});
