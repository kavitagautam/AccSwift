import { TestBed } from '@angular/core/testing';

import { PurchaseInvoiceService } from './purchase-invoice.service';

describe('PurchaseInvoiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PurchaseInvoiceService = TestBed.get(PurchaseInvoiceService);
    expect(service).toBeTruthy();
  });
});
