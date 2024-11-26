import { Location } from '@angular/common';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthService } from '.';

@Injectable({
  providedIn: 'root',
})
export class SettingService {
  destroy$ = new Subject<void>();
  private _color$: BehaviorSubject<string> = new BehaviorSubject<string>(
    'blue'
  );
  private _adminId = 0;
  constructor(private authService: AuthService, private location: Location) {
    this.authService
      .getUser()
      .pipe(takeUntil(this.destroy$))
      .subscribe((user) => {
        if (user) {
          this.setColor(user.color);
          this._adminId = user.adminId;
        }
      });
  }

  setColor(color: string) {
    this._color$.next(color);
  }
  getColor() {
    return this._color$;
  }
  getAdminId() {
    return this._adminId;
  }

  getFullPath() {
    return window.location.href;
  }
  getPath() {
    return this.location.path(true);
  }
  getHost() {
    return window.location.host;
  }
  getProtocol() {
    return window.location.protocol;
  }
  getServerPath() {
    return window.location.protocol + '//' + window.location.host;
  }
}
