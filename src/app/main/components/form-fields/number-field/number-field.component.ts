import {
  Component,
  ElementRef,
  forwardRef,
  HostListener,
  Input,
  OnInit,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  FormGroup,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
@Component({
  selector: 'o-number-field',
  templateUrl: './number-field.component.html',
  styleUrls: ['./number-field.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NumberFieldComponent),
      multi: true,
    },
  ],
})
export class NumberFieldComponent implements OnInit, ControlValueAccessor {
  @Input() value: number = 0;
  onChange = (_: any) => {};
  onTouch = () => {};
  control = new FormControl(this.value);

  constructor(private readonly elementRef: ElementRef) {
    this.control.valueChanges.subscribe((value) => {
      //console.log(value);

      this.onChange(value);
    });
  }
  onKeyDown(event: KeyboardEvent) {
    let current: string = this.elementRef.nativeElement.value;
    console.log(this.control.value);
    this.control.valueChanges.subscribe((value: number) => {
      console.log(value);
      if (value > 127) {
        console.log('invalid: ' + value);
        event.preventDefault();
      }
    });
  }
  ngOnInit(): void {}
  writeValue(obj: any): void {
    this.value = obj;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }
  readonly errorStateMatcher: ErrorStateMatcher = {
    isErrorState: (ctrl: FormControl) => ctrl && ctrl.invalid,
  };
}
