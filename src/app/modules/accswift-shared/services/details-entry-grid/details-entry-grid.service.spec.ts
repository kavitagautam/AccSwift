import { TestBed } from '@angular/core/testing';

import { DetailsEntryGridService } from './details-entry-grid.service';

describe('DetailsEntryGridService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DetailsEntryGridService = TestBed.get(DetailsEntryGridService);
    expect(service).toBeTruthy();
  });
});
