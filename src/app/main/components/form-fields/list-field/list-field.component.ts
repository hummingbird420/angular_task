import { Component, forwardRef, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DictionaryService } from 'src/app/services';

@Component({
  selector: 'o-list-field',
  templateUrl: './list-field.component.html',
  styleUrls: ['./list-field.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ListFieldComponent),
      multi: true,
    },
  ],
})
export class ListFieldComponent implements OnInit, ControlValueAccessor {
  value = '';

  onChange = (_: any) => {};

  onTouch = () => {};

  constructor(public dictionaryService: DictionaryService) {}

  ngOnInit(): void {}

  writeValue(obj: any): void {
    const normalizeValue = obj == null ? '' : obj;
    this.value = normalizeValue;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }
}
