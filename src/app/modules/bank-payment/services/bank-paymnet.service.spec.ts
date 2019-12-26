import { TestBed } from '@angular/core/testing';

import { BankPaymnetService } from './bank-paymnets.service';

describe('BankPaymnetService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BankPaymnetService = TestBed.get(BankPaymnetService);
    expect(service).toBeTruthy();
  });
});
