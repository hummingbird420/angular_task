import { Component, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormControl, ValidatorFn } from '@angular/forms';
import { map, takeUntil } from 'rxjs/operators';
import { SimpleFormPage } from 'src/app/main/page';
import { SortedFieldInfo } from 'src/app/models';
import { ApiService, DictionaryService } from 'src/app/services';
import { getCommonValidators, OrbundValidators } from 'src/app/util';
import { FormField } from 'src/app/util/utility-funtions';

@Component({ templateUrl: './add-edit-tuition.component.html' })
export class AddEditTuitionComponent extends SimpleFormPage {
  title: string = 'Add Edit Dialog';
  addButtonLabel: string = 'Add';
  closeButtonLabel = 'Close';
  addIcon: string = 'add';
  protected actionListner: EventEmitter<boolean> = new EventEmitter<boolean>(
    false
  );
  constructor(protected dictionaryService: DictionaryService) {
    super();
    this.dictionaryService
      .getTranslatedWord(this.title)
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data) => (this.title = data));

    this.dictionaryService
      .getTranslatedWord(this.addButtonLabel)
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data) => (this.addButtonLabel = data));

    this.dictionaryService
      .getTranslatedWord(this.closeButtonLabel)
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data) => (this.closeButtonLabel = data));
  }

  getFormFields(
    formBuilder: FormBuilder,
    apiService: ApiService,
    apiUrl: string,
    data: any
  ) {
    return apiService.post<SortedFieldInfo<any, number>[]>(apiUrl, data).pipe(
      map((fields) => {
        let formControls: FormField<FormControl> = {};
        fields.forEach((field, index) => {
          formControls[field.fieldName] = new FormControl(
            field.fieldValue,
            this.getValidators(field)
          );
          this.formFields[this.alphaIndex(index)] = field;
        });
        this.formGroup = formBuilder.group(formControls);
        return fields;
      })
    );
  }
  getFormFieldsByGet(
    formBuilder: FormBuilder,
    apiService: ApiService,
    apiUrl: string
  ) {
    return apiService.get<SortedFieldInfo<any, number>[]>(apiUrl).pipe(
      map((fields) => {
        let formControls: FormField<FormControl> = {};
        fields.forEach((field, index) => {
          formControls[field.fieldName] = new FormControl(
            field.fieldValue,
            this.getValidators(field)
          );
          this.formFields[this.alphaIndex(index)] = field;
        });
        this.formGroup = formBuilder.group(formControls);
        return fields;
      })
    );
  }
  getValidators(field: SortedFieldInfo<any, number>): ValidatorFn[] {
    const validators = getCommonValidators(field, this.dictionaryService);

    if (this.requiredFields.includes(field.fieldName)) {
      validators.push(
        OrbundValidators.required(field.fieldTitle, this.dictionaryService)
      );
    }

    return validators;
  }

  saveTuition() {
    this.formGroup.markAllAsTouched();
    if (this.formGroup.invalid) {
      this.formGroup.markAllAsTouched();
      this.formGroup.controls.fee.markAsDirty();
      return false;
    }
    return true;
  }
  getActionListner() {
    return this.actionListner.asObservable();
  }
}
export type ObjectType<T> = {
  [key: string]: T;
};
