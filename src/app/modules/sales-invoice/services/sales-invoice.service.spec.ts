import { TestBed } from '@angular/core/testing';

import { SalesInvoiceService } from './sales-invoice.service';

describe('SalesInvoiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SalesInvoiceService = TestBed.get(SalesInvoiceService);
    expect(service).toBeTruthy();
  });
});
