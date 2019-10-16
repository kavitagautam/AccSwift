import { TestBed } from '@angular/core/testing';

import { LedgerCodeMatchService } from './ledger-code-match.service';

describe('LedgerCodeMatchService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LedgerCodeMatchService = TestBed.get(LedgerCodeMatchService);
    expect(service).toBeTruthy();
  });
});
