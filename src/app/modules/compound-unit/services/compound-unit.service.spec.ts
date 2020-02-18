import { TestBed } from '@angular/core/testing';

import { CompoundUnitService } from './compound-unit.service';

describe('CompoundUnitService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CompoundUnitService = TestBed.get(CompoundUnitService);
    expect(service).toBeTruthy();
  });
});
