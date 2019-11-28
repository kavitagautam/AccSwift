import { TestBed } from '@angular/core/testing';

import { CashPaymentsService } from './cash-payments.service';

describe('CashPaymentsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CashPaymentsService = TestBed.get(CashPaymentsService);
    expect(service).toBeTruthy();
  });
});
