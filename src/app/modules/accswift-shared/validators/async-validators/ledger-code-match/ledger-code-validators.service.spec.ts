import { TestBed } from "@angular/core/testing";

import { LedgerCodeAsyncValidators } from "./ledger-code-validators.service";

describe("LedgerCodeMatchService", () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it("should be created", () => {
    const service: LedgerCodeAsyncValidators = TestBed.get(
      LedgerCodeAsyncValidators
    );
    expect(service).toBeTruthy();
  });
});
