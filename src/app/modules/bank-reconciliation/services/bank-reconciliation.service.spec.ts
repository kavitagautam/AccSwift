import { TestBed } from "@angular/core/testing";

import { BankReconciliationService } from "./bank-reconciliation.service";

describe("BankReconciliationService", () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it("should be created", () => {
    const service: BankReconciliationService = TestBed.get(
      BankReconciliationService
    );
    expect(service).toBeTruthy();
  });
});
