import { TestBed } from '@angular/core/testing';

import { CashPartyService } from './cash-party.service';

describe('CashPartyService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CashPartyService = TestBed.get(CashPartyService);
    expect(service).toBeTruthy();
  });
});
