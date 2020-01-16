import { TestBed } from "@angular/core/testing";

import { CashReceiptService } from "./cash-receipt.service";

describe("CashReceiptService", () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it("should be created", () => {
    const service: CashReceiptService = TestBed.get(CashReceiptService);
    expect(service).toBeTruthy();
  });
});
