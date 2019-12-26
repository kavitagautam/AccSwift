import { TestBed } from '@angular/core/testing';

import { ContraVoucherService } from './contra-voucher.service';

describe('ContraVoucherService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ContraVoucherService = TestBed.get(ContraVoucherService);
    expect(service).toBeTruthy();
  });
});
