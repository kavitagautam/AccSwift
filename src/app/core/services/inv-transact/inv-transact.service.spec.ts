import { TestBed } from '@angular/core/testing';

import { InvTransactService } from './inv-transact.service';

describe('InvTransactService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: InvTransactService = TestBed.get(InvTransactService);
    expect(service).toBeTruthy();
  });
});
