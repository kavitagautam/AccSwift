import { TestBed } from '@angular/core/testing';

import { SalesReturnService } from './sales-return.service';

describe('SalesReturnService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SalesReturnService = TestBed.get(SalesReturnService);
    expect(service).toBeTruthy();
  });
});
