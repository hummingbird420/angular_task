import { TitleCasePipe } from '@angular/common';
import { Component, forwardRef, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatRadioChange } from '@angular/material/radio';
import { Observable, of, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from 'src/app/services';
import { SettingService } from 'src/app/services/setting.service';
export interface ThemeColorInfo {
  value: string;
  title: string;
}

@Component({
  selector: 'o-theme-color-chooser',
  templateUrl: './theme-color.chooser.html',
  styleUrls: ['./theme-color.chooser.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ThemeColorChooser),
      multi: true,
    },
  ],
})
export class ThemeColorChooser implements OnInit, ControlValueAccessor {
  destroy$: Subject<void> = new Subject();

  colors: Observable<ThemeColorInfo[]>;
  value: string = '';
  initColors = [
    this.createThemeColor('blue'),
    this.createThemeColor('chocolate'),
    this.createThemeColor('green'),
    this.createThemeColor('orange'),
    this.createThemeColor('purple'),
    this.createThemeColor('red'),
    this.createThemeColor('redorange'),
  ];
  onChange = (_: any) => {};
  onTouched = () => {};
  constructor(
    private titleCasePipe: TitleCasePipe,
    private apiSevice: ApiService,
    private settingService: SettingService
  ) {
    this.colors = of(this.initColors);
    this.colors = this.apiSevice.get<ThemeColorInfo[]>('theme-colors').pipe(
      map((data) => {
        const colors: ThemeColorInfo[] = [];
        for (let index = 0; index < data.length; index++) {
          const color = data[index];
          colors.push(this.createThemeColor(color.value, color.title));
        }
        return colors;
      })
    );
  }
  writeValue(obj: any): void {
    const normalizedValue = obj == null ? '' : obj;
    this.value = normalizedValue;
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  ngOnInit(): void {}

  colorChange(event: MatRadioChange) {
    this.value = event.value;
    this.onChange(event.value);
    this.settingService.setColor(event.value);
  }
  createThemeColor(color: string, title?: string): ThemeColorInfo {
    return {
      value: color.toLowerCase(),
      title: this.titleCasePipe.transform(title ? title : color),
    };
  }
}
