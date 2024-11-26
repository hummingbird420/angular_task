import { Component, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthService } from '../services';
import { SettingService } from '../services/setting.service';

@Component({
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPage implements OnInit, OnDestroy {
  destroy$: Subject<void> = new Subject();
  themeColor: string = 'blue' + 1;

  constructor(
    private renderer: Renderer2,
    private settingService: SettingService
  ) {
    this.settingService
      .getColor()
      .pipe(takeUntil(this.destroy$))
      .subscribe((color) => {
        this.renderer.removeClass(document.body, this.themeColor);
        this.themeColor = color + '1';
        this.renderer.addClass(document.body, this.themeColor);
      });
  }

  ngOnInit(): void {}
  ngOnDestroy() {
    this.renderer.removeClass(document.body, this.themeColor);
    this.destroy$.next();
    this.destroy$.complete();
  }
}
