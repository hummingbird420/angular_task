import { Component, forwardRef, Input, OnInit } from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  FormGroup,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { FormField } from 'src/app/util/utility-funtions';

@Component({
  selector: 'o-text-field',
  templateUrl: './text-field.component.html',
  styleUrls: ['./text-field.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextFieldComponent),
      multi: true,
    },
  ],
})
export class TextFieldComponent implements OnInit, ControlValueAccessor {
  @Input() maxLength: number = 250;

  @Input() value: any = '';
  onChange = (_: any) => {};
  onTouch = () => {};

  control = new FormControl(this.value);

  constructor() {}

  ngOnInit(): void {
    this.control = new FormControl(this.value);
  }

  writeValue(obj: any): void {
    this.value = obj;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  onValueChange() {
    this.onChange(this.control.value);
  }

  onFocus() {
    console.log('text field focus..');
  }
}
