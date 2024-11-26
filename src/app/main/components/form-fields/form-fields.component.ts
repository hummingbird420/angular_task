import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { SortedFieldInfo } from 'src/app/models';
import { FormField } from 'src/app/util/utility-funtions';

@Component({
  selector: 'o-form-fields',
  templateUrl: './form-fields.component.html',
  styleUrls: ['./form-fields.component.scss'],
})
export class FormFieldsComponent {
  @Input() layout: string = 'column';
  @Input() fields: Observable<SortedFieldInfo<any, any>[]> = of([]);
  @Input() formFields: FormField<SortedFieldInfo<any, number | string>> = {};
  @Input() formGroup: FormGroup = new FormGroup({});
  @Input() requiredFields: string[] = [];
  @Input() currencySign: string = '$';

  maxValue = Number.MAX_SAFE_INTEGER;
  maxLengthText = (length: number) => (length || 250) + 1;
  maxLengthPassword = (length: number) => (length || 50) + 1;
  maxLengthMemo = (length: number) => (length || 2500) + 1;
  maxLengthRichEditor = (length: number) => (length || 1000000) + 1;
  required = (fieldName: string) => this.requiredFields.includes(fieldName);

  activeControl: string = '';
  adjustMargin: boolean | null = null;

  isInvalid(fieldName: string): boolean {
    const control = this.formGroup.controls[fieldName];
    return (control.dirty || control.touched) && control.invalid;
  }

  getErrorMessage(fieldName: string, title: string): string | null {
    return this.formGroup.controls[fieldName].errors!.message;
  }
}
