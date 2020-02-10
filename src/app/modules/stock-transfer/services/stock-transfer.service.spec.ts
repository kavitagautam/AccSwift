import { TestBed } from '@angular/core/testing';

import { StockTransferService } from './stock-transfer.service';

describe('StockTransferService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: StockTransferService = TestBed.get(StockTransferService);
    expect(service).toBeTruthy();
  });
});
