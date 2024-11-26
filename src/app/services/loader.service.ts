import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
} from '@angular/router';
import { Store } from '@ngxs/store';
import { filter, take } from 'rxjs/operators';
import { StartAppLoader, StopAppLoader } from '../app.state';
import { RightLinkService } from './right-link.service';

@Injectable({
  providedIn: 'root',
})
export class LoaderService {
  constructor(
    private router: Router,
    private rightLinkService: RightLinkService,
    private dailog: MatDialog,
    private store: Store
  ) {}

  initializeLoader(): void {
    this.router.events
      .pipe(
        filter(
          (event) =>
            event instanceof NavigationStart ||
            event instanceof NavigationEnd ||
            event instanceof NavigationCancel ||
            event instanceof NavigationError
        )
      )
      .subscribe((event) => {
        if (event instanceof NavigationStart) {
          this.dailog.closeAll();
          this.start();
          this.rightLinkService.setRightLinks('');
        } else {
          this.end();
        }
      });
  }

  start(): void {
    setTimeout(() => {
      this.store.dispatch(new StartAppLoader()).pipe(take(1));
    });
  }

  end(): void {
    setTimeout(() => {
      this.store.dispatch(new StopAppLoader()).pipe(take(1));
    }, 50);
  }
}
