import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { API_URL } from '../constants/api-url';
import { User } from '../models';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private userSubject: BehaviorSubject<User | null>;
  private user: Observable<User | null>;
  private _isLogin: boolean = false;

  constructor(private router: Router, private http: HttpClient) {
    this.userSubject = new BehaviorSubject<User | null>(null);
    this.user = this.userSubject.asObservable();
  }

  public get isLogin() {
    return this._isLogin;
  }

  getUser() {
    return this.user;
  }

  checkAuthentication(falseCallBakck?: any) {
    return this.http.get<User>(`${API_URL.auth_root}check-authentication`).pipe(
      map((user) => {
        if (user && user.userId) {
          this.userSubject.next(user);
          this._isLogin = true;
          return true;
        }
        if (falseCallBakck) {
          falseCallBakck();
        }
        this._isLogin = false;
        return false;
      }),
      catchError((e) => {
        if (falseCallBakck) {
          falseCallBakck();
        }
        this._isLogin = false;
        return of(false);
      })
    );
  }
  checkMicrosoftCredential() {
    return this.http.get(`${API_URL.auth_root}sso/check-microsoft-login`);
  }
  authenticate(credentials: { username: string; password: string; userRole: number }) {
    return this.http.post<User>(`${API_URL.auth_root}login`, credentials).pipe(
      tap((user) => {
        this.userSubject.next(user);
        this._isLogin = true;
        return user;
      })
    );
  }
  getMicrosoftCredential() {
    return this.http.get(`${API_URL.auth_root}sso/microsoft-login`);
  }
  varifyMicrosoftCredential(credentials: any) {
    return this.http.post<any>(`${API_URL.auth_root}sso/microsoft-verify-login`, credentials);
  }
  microsoftUserIdentity(credentials: any) {
    return this.http.post<any>(`${API_URL.auth_root}sso/microsoft-user-identify`, credentials);
  }
  logout() {
    // remove user from local storage and set current user to null
    this._isLogin = false;
    this.http.get(`${API_URL.auth_root}logout`).subscribe((response) => {
      this.userSubject.next(null);
      this.router.navigate(['/auth/login']);
    });
  }
  aggrementPolicy() {
    return this.http.post<User>(`${API_URL.auth_root}sign-agreement`, {}).pipe(
      map((user) => {
        this.userSubject.next(user);
        this._isLogin = true;
        return user;
      })
    );
  }
  forgotPassword(credentials: { username: string; email: string; userRole: number }) {
    return this.http.post<any>(`${API_URL.auth_root}forgot-password`, credentials);
  }
  varifyOTP(credentials: { otp: string }) {
    return this.http.post<any>(`${API_URL.auth_root}verify-otp`, credentials);
  }

  resendEmail() {
    return this.http.post<any>(`${API_URL.auth_root}send-otp?otpOption=email`, {});
  }
  resendMessage() {
    return this.http.post<any>(`${API_URL.auth_root}send-otp?otpOption=sms`, {});
  }
}
