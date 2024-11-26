import { TestBed } from '@angular/core/testing';

import { SessionResolver } from './session.resolver';

describe('SessionResolver', () => {
  let resolver: SessionResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(SessionResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
