import {
  ChangeDetectorRef,
  Component,
  forwardRef,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormBuilder,
  FormControl,
  FormGroup,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { Subscription } from 'rxjs';
import { FormField } from 'src/app/util/utility-funtions';
import { Option } from '../../models';

@Component({
  selector: 'cart-multi-checkbox',
  templateUrl: './cart-multi-checkbox.component.html',
  styleUrls: ['./cart-multi-checkbox.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CartMultiCheckboxComponent),
      multi: true,
    },
  ],
})
export class CartMultiCheckboxComponent
  implements OnInit, ControlValueAccessor
{
  value: any = '';
  onChange: Function = (_: any) => {};
  onTouch: Function = () => {};
  @Input() checkboxes: Option<string, string>[] = [];
  @Input() layout: 'row' | 'column' = 'column';

  checkboxGroup: FormGroup;
  values: { [key: string]: any } = {};

  constructor(private formBuilder: FormBuilder) {
    this.checkboxGroup = this.formBuilder.group({});
  }

  ngOnInit(): void {
    const values = ',' + this.value;
    let controls: FormField<FormControl> = {};
    for (let i = 0; i < this.checkboxes.length; i++) {
      const checkbox = this.checkboxes[i];
      const name = 'checkbox_' + i + '_' + checkbox.value;
      const checked = values.includes(',' + checkbox.value + ',');
      controls[name] = new FormControl(checked);
      this.values[name] = checkbox.value;
    }
    this.checkboxGroup = this.formBuilder.group(controls);
  }

  writeValue(value: any): void {
    if (value) {
      value = ',' + value;
      const len = this.checkboxes.length;
      const values: { [key: string]: any } = {};
      for (let i = 0; i < len; i++) {
        const checkbox = this.checkboxes[i];
        const name = 'checkbox_' + i + '_' + checkbox.value;
        const checked = value.includes(',' + checkbox.value + ',');
        values[name] = checked;
      }
      this.checkboxGroup.setValue(values, { emitEvent: false });
    }
  }

  registerOnChange(fn: (_: any) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  onCheckboxChange(event: MatCheckboxChange) {
    let values = '';
    const value = this.checkboxGroup.value;
    for (const name in value) {
      if (value[name] === true) {
        values = values + this.values[name] + ',';
      }
    }
    this.onChange(values);
  }
}
