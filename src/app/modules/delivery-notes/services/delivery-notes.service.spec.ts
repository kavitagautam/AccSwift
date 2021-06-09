import { TestBed } from '@angular/core/testing';

import { DeliveryNotesService } from './delivery-notes.service';

describe('DeliveryNotesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DeliveryNotesService = TestBed.get(DeliveryNotesService);
    expect(service).toBeTruthy();
  });
});
