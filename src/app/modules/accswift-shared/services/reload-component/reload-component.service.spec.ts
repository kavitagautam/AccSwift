import { TestBed } from '@angular/core/testing';

import { ReloadComponentService } from './reload-component.service';

describe('ReloadComponentService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ReloadComponentService = TestBed.get(ReloadComponentService);
    expect(service).toBeTruthy();
  });
});
