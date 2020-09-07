import { TestBed } from '@angular/core/testing';

import { AccessRoleService } from './access-role.service';

describe('AccessRoleService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AccessRoleService = TestBed.get(AccessRoleService);
    expect(service).toBeTruthy();
  });
});
