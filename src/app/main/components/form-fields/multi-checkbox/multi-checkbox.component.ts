import {
  ChangeDetectorRef,
  Component,
  forwardRef,
  Input,
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
import { CheckboxInfo } from 'src/app/models/checkbox.info';
import { DictionaryService } from 'src/app/services';
import { OrbundValidators } from 'src/app/util';
import { FormField } from 'src/app/util/utility-funtions';

@Component({
  selector: 'o-multi-checkbox',
  templateUrl: './multi-checkbox.component.html',
  styleUrls: ['./multi-checkbox.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MultiCheckboxComponent),
      multi: true,
    },
  ],
})
export class MultiCheckboxComponent implements OnInit, ControlValueAccessor {
  value: any = '';
  onChange = (_: any) => {};
  onTouch = () => {};

  @Input() checkboxes: CheckboxInfo[] = [];
  @Input() layout: 'row' | 'column' = 'column';
  formGroup: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    private cdRef: ChangeDetectorRef,
    private dictionaryService: DictionaryService
  ) {
    this.formGroup = this.formBuilder.group({});
  }

  ngOnInit(): void {
    let controls: FormField<FormControl> = {};
    for (let i = 0; i < this.checkboxes.length; i++) {
      const checkboxInfo = this.checkboxes[i];
      let validators = null;
      if (checkboxInfo.required) {
        validators = [
          OrbundValidators.required(checkboxInfo.title, this.dictionaryService),
        ];
      }
      controls[checkboxInfo.name] = new FormControl(
        checkboxInfo.checked,
        validators
      );
    }
    this.formGroup = this.formBuilder.group(controls);
    this.cdRef.detectChanges();
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

  onCheckboxChange(event: MatCheckboxChange) {
    const name = event.source.name;

    this.checkboxes.forEach((checkboxInfo) => {
      if (checkboxInfo.name === name) {
        checkboxInfo.checked = event.checked;
      }
    });

    this.onChange(this.formGroup.value);
  }
}
