import { TestBed } from '@angular/core/testing';

import { BankPaymnetsService } from './bank-paymnets.service';

describe('BankPaymnetsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BankPaymnetsService = TestBed.get(BankPaymnetsService);
    expect(service).toBeTruthy();
  });
});
