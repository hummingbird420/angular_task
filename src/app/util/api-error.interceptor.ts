import { Injectable, Injector } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import {
  catchError,
  delay,
  mergeMap,
  retry,
  retryWhen,
  take,
} from 'rxjs/operators';
import { AuthService } from '../services';
import { Router } from '@angular/router';

@Injectable()
export class ApiErrorInterceptor implements HttpInterceptor {
  constructor(private injector: Injector) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const authService = this.injector.get(AuthService);
    const apiUrl = request.url;
    return next.handle(request).pipe(
      retryWhen((obs) =>
        obs.pipe(
          mergeMap((response) => {
            if (
              response.status === 401 &&
              !(
                apiUrl.endsWith('check-auth') || apiUrl.endsWith('authenticate')
              )
            ) {
              authService.logout();
            }
            if (response.status === 404) {
              // return of(response).pipe(delay(2000), take(1));
            }
            return throwError({ error: response });
          })
        )
      )
    );
  }
}
