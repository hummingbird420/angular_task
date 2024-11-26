import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable, of } from 'rxjs';
import { take, map, catchError } from 'rxjs/operators';
import { UpdateSessionId } from '../app.state';
import { RemoveAllFromCart } from '../shopping-cart/cart-states';

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  constructor(private http: HttpClient, private store: Store) {}

  initSession(): Observable<string> {
    let sessionId = localStorage.getItem('SESSION_ID');

    if (sessionId) {
      //if browser get refreshed by user then the ngxs store get clear as well. So we need to update the ngxs store.
      this.store.dispatch(new UpdateSessionId(sessionId)).pipe(take(1));
      return this.validateOrCreateSession(sessionId);
    }
    return this.fetchNewSessionId();
  }

  validateSession(): Observable<string> {
    let sessionId = localStorage.getItem('SESSION_ID');

    if (sessionId) {
      return this.http
        .post<any>(`public/translated-words`, ['Student'])
        .pipe(take(1))
        .pipe(
          map((response) => {
            if (sessionId) {
              this.updateSessionState(sessionId);
              return sessionId;
            }
            return 'Your Session has expired.';
          })
        )
        .pipe(catchError((errors) => 'Your session has expired.'));
    }
    return of('Your Session has expired.');
  }

  private validateOrCreateSession(sessionId: string): Observable<string> {
    return this.http
      .post<any>(`public/translated-words`, ['Student'])
      .pipe(take(1))
      .pipe(
        map((response) => {
          this.updateSessionState(sessionId);
          return sessionId;
        })
      )
      .pipe(catchError((errors) => this.handleError(errors)));
  }

  private fetchNewSessionId(): Observable<string> {
    return this.http
      .get<{ sessionId: string }>('public/session-id')
      .pipe(take(1))
      .pipe(
        map((response) => {
          // we will clear storage for new session.
          this.store.dispatch(new RemoveAllFromCart());
          localStorage.clear();
          this.updateSessionState(response.sessionId);
          return response.sessionId;
        })
      );
  }

  private updateSessionState(sessionId: string) {
    localStorage.setItem('SESSION_ID', sessionId);
    this.store.dispatch(new UpdateSessionId(sessionId)).pipe(take(1));
  }

  private handleError(errors: any): Observable<string> {
    const error = errors.error.error;
    if (error && error.hasOwnProperty('error')) {
      const errorMessage = error.error.message;
      if (error.error.code === 605) {
        return this.fetchNewSessionId();
      }
    }
    return of('');
  }
}
