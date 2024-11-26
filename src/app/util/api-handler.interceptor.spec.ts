import { TestBed } from '@angular/core/testing';

import { ApiHandlerInterceptor } from './api-handler.interceptor';

describe('ApiHandlerInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      ApiHandlerInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: ApiHandlerInterceptor = TestBed.inject(ApiHandlerInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
