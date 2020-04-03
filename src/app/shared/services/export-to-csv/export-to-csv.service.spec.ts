import { TestBed } from '@angular/core/testing';

import { ExportToCsvService } from './export-to-csv.service';

describe('ExportToCsvService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ExportToCsvService = TestBed.get(ExportToCsvService);
    expect(service).toBeTruthy();
  });
});
