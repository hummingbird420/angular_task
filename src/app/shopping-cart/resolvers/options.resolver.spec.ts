import { TestBed } from '@angular/core/testing';

import { OptionsResolver } from './options.resolver';

describe('OptionsResolver', () => {
  let resolver: OptionsResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(OptionsResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
