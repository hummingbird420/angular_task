import { TestBed } from '@angular/core/testing';

import { LocalStorageResolver } from './local-storage.resolver';

describe('LocalStorageResolver', () => {
  let resolver: LocalStorageResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(LocalStorageResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
