import {
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map, take, takeUntil } from 'rxjs/operators';
import { SimpleFormPage } from 'src/app/main/page';
import { SortedFieldInfo } from 'src/app/models';
import {
  AlertService,
  ApiService,
  AuthService,
  DictionaryService,
} from 'src/app/services';
import { DialogService } from 'src/app/services/dialog.service';
import { getCommonValidators } from 'src/app/util';
import { FormField } from 'src/app/util/utility-funtions';

type ObjectType<T> = {
  [key: string]: T;
};

@Component({
  selector: 'o-credit-hour-tuition',
  templateUrl: './credit-hour-tuition.rate.html',
})
export class CreditHourTuitionRate
  extends SimpleFormPage
  implements OnInit, OnDestroy
{
  saveButtonLabel = this.dictionaryService.getTranslationOrWord('Save');
  @Input() semesterId: Observable<number> = of(0);
  selectedSemesterId: number = 0;
  currencySign: string = '$';

  fieldMap: Map<string, SortedFieldInfo<any, any>> = new Map();
  maxValue = Number.MAX_SAFE_INTEGER;
  maxLengthText = (length: number) => (length || 250) + 1;
  maxLengthPassword = (length: number) => (length || 50) + 1;
  maxLengthMemo = (length: number) => (length || 2500) + 1;
  maxLengthRichEditor = (length: number) => (length || 1000000) + 1;
  required = (fieldName: string) => this.requiredFields.includes(fieldName);

  activeControl: string = '';
  adjustMargin: boolean | null = null;
  constructor(
    protected apiService: ApiService,
    private dictionaryService: DictionaryService,
    private alertService: AlertService,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private cdRef: ChangeDetectorRef
  ) {
    super();
  }

  ngOnDestroy(): void {
    this.destroyed();
  }

  ngOnInit(): void {
    this.authService
      .getUser()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((user) => {
        if (user && user.currencySign) {
          this.currencySign = user.currencySign;
        }
      });
    this.semesterId.pipe(takeUntil(this.destroyed$)).subscribe((data) => {
      this.selectedSemesterId = data;
      this.initForm();
    });
  }

  getFormField(key: string): SortedFieldInfo<any, any> {
    return this.fieldMap.get(key) || ({} as SortedFieldInfo<any, any>);
  }

  isInvalid(fieldName: string): boolean {
    const control = this.formGroup.controls[fieldName];
    return (control.dirty || control.touched) && control.invalid;
  }

  getErrorMessage(fieldName: string, title: string): string | null {
    return this.formGroup.controls[fieldName].errors!.message;
  }

  saveTuitionRate() {
    if (this.formGroup.invalid) {
      this.formGroup.markAllAsTouched();
      this.alertService.showErrorAlert(
        'Please provide the requied and valid information.'
      );
      return;
    }

    const value = this.formGroup.value;
    const tuitionRateInfo: ObjectType<string | number | Object> = {};
    const tuitionRates: ObjectType<string | number> = {};
    const maxCredits: ObjectType<string | number> = {};
    const minCredits: ObjectType<string | number> = {};
    tuitionRateInfo.semesterId = this.selectedSemesterId;

    for (const key in value) {
      if (key.startsWith('tuitionRate')) {
        tuitionRates[key] = value[key];
      } else if (key.startsWith('maxCredit')) {
        maxCredits[key] = value[key];
      } else if (key.startsWith('minCredit')) {
        minCredits[key] = value[key];
      } else {
        tuitionRateInfo[key] = value[key];
      }
    }

    tuitionRateInfo['tuitionRates'] = tuitionRates;
    tuitionRateInfo['maxCredits'] = maxCredits;
    tuitionRateInfo['minCredits'] = minCredits;
    console.log(value);
    console.log(tuitionRateInfo);
    this.apiService
      .post('tuition/save-credit-hour-tuition-rate', tuitionRateInfo)
      .pipe(take(1))
      .subscribe((data) => {
        console.log(data);

        this.initForm();
        this.cdRef.detectChanges();
      });
  }

  private initForm() {
    this.formFields$ = this.apiService
      .get<SortedFieldInfo<any, string | number>[]>(
        this.createUrl(
          'tuition/credit-hour-tuition-fields',
          this.selectedSemesterId
        )
      )
      .pipe(
        map((fields) => {
          let formControls: FormField<FormControl> = {};
          fields.forEach((field) => {
            let validators = this.getValidators(field);
            formControls[field.fieldName] = new FormControl(
              field.fieldValue,
              validators
            );
            this.fieldMap.set(field.fieldName, field);
          });
          this.formGroup = this.formBuilder.group(formControls);
          return fields;
        }),
        takeUntil(this.destroyed$)
      );
  }

  getValidators(field: SortedFieldInfo<any, any>) {
    const validators = getCommonValidators(field, this.dictionaryService);

    return validators;
  }
}
