import { TestBed } from '@angular/core/testing';

import { FilterResolver } from './filter.resolver';

describe('FilterResolver', () => {
  let resolver: FilterResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(FilterResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
