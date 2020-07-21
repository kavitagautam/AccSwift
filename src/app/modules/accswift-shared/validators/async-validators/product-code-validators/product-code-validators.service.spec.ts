import { TestBed } from '@angular/core/testing';

import { ProductCodeValidatorsService } from './product-code-validators.service';

describe('ProductCodeValidatorsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ProductCodeValidatorsService = TestBed.get(ProductCodeValidatorsService);
    expect(service).toBeTruthy();
  });
});
