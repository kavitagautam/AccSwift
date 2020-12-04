import { TestBed } from '@angular/core/testing';

import { AccTransactService } from './acc-transact.service';

describe('AccTransactService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AccTransactService = TestBed.get(AccTransactService);
    expect(service).toBeTruthy();
  });
});
