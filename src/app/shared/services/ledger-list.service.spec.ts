import { TestBed } from '@angular/core/testing';

import { LedgerListService } from './ledger-list.service';

describe('LedgerListService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LedgerListService = TestBed.get(LedgerListService);
    expect(service).toBeTruthy();
  });
});
