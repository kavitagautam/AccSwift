import { TestBed } from '@angular/core/testing';

import { UnitMaintenanceService } from './unit-maintenance.service';

describe('UnitMaintenanceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UnitMaintenanceService = TestBed.get(UnitMaintenanceService);
    expect(service).toBeTruthy();
  });
});
