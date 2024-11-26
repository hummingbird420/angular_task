import {
  AbstractControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import * as moment from 'moment';
import { isMoment } from 'moment';
import { SortedFieldInfo } from '../models';
import { DictionaryService } from '../services';

export class OrbundValidators {
  static required(title: string, dictionaryService: DictionaryService) {
    return (control: AbstractControl): ValidationErrors | null => {
      let hasNoValue = control.value === undefined || control.value === null;

      if (typeof control.value === 'string') {
        hasNoValue = hasNoValue || control.value.trim() === '';
      }
      return hasNoValue
        ? {
            message:
              title +
              ' ' +
              dictionaryService.getTranslationOrWord('is required.'),
          }
        : null;
    };
  }

  static atLeastOneValue(dictionaryService: DictionaryService) {
    return (form: AbstractControl): ValidationErrors | null => {
      return Object.keys(form.value).some((key) => !!form.value[key])
        ? null
        : {
            message: dictionaryService.getTranslationOrWord(
              'Please select at least one.'
            ),
          };
    };
  }

  static isInvalid(formGroup: FormGroup, fieldName: string): boolean {
    const field = formGroup.controls[fieldName];
    return field !== null && (field.invalid || field.dirty || field.touched);
  }

  static positiveNumeric(
    fieldTitle: string,
    dictionaryService: DictionaryService
  ) {
    return (control: AbstractControl): ValidationErrors | null => {
      const regexPositive: RegExp = new RegExp(/^[0-9]\d*$/);
      return String(control.value).match(regexPositive)
        ? null
        : {
            message:
              fieldTitle +
              ' ' +
              dictionaryService.getTranslationOrWord(
                'should be positive integer number.'
              ),
          };
    };
  }
  static decimal(fieldTitle: string, dictionaryService: DictionaryService) {
    return (control: AbstractControl): ValidationErrors | null => {
      const regexDecimal: RegExp = new RegExp(/^\d*\.?\d{0,2}$/g);
      return String(control.value).match(regexDecimal)
        ? null
        : {
            message:
              fieldTitle +
              ' ' +
              dictionaryService.getTranslationOrWord(
                'should be decimal number.'
              ),
          };
    };
  }
  static maxValue(maxValue: number, dictionaryService: DictionaryService) {
    return (control: AbstractControl): ValidationErrors | null => {
      return control.value && control.value > maxValue
        ? {
            message:
              dictionaryService.getTranslationOrWord('Maximum value') +
              ' ' +
              maxValue +
              '.',
          }
        : null;
    };
  }

  static minValue(minValue: number, dictionaryService: DictionaryService) {
    return (control: AbstractControl): ValidationErrors | null => {
      return control.value && control.value < minValue
        ? {
            message:
              dictionaryService.getTranslationOrWord('Minimum value') +
              ' ' +
              minValue +
              '.',
          }
        : null;
    };
  }

  static maxLength(maxLength: number, dictionaryService: DictionaryService) {
    return (control: AbstractControl): ValidationErrors | null => {
      return control.value && control.value.length > maxLength
        ? {
            message:
              dictionaryService.getTranslationOrWord('Maximum length') +
              ' ' +
              maxLength +
              '.',
          }
        : null;
    };
  }

  static email(fieldTitle: string, dictionaryService: DictionaryService) {
    return (control: AbstractControl): ValidationErrors | null => {
      const emailPattern =
        /(?=[a-z0-9][a-z0-9@._%+-]{5,253}$)[a-z0-9._%+-]{1,64}@(?:(?=[a-z0-9-]{1,63}\.)[a-z0-9]+(?:-[a-z0-9]+)*\.){1,8}[a-z]{2,63}$/;
      const value = control.value;
      if (value && value.trim().length && !emailPattern.test(value)) {
        return {
          message:
            fieldTitle +
            ' ' +
            dictionaryService.getTranslationOrWord('is invalid.'),
        };
      }
      return null;
    };
  }

  static date(fieldTitle: string, dictionaryService: DictionaryService) {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      console.log(value);
      let invalid = false;
      if (
        value &&
        typeof value === 'string' &&
        !moment(value, 'yyyy-MM-DD', true).isValid()
      ) {
        invalid = true;
      }

      if (value && isMoment(value)) {
        const m: moment.Moment = value;
        if (!m.isValid()) {
          invalid = true;
        }
      }

      if (invalid) {
        return {
          message:
            fieldTitle +
            ' ' +
            dictionaryService.getTranslationOrWord('is invalid.'),
        };
      }
      return null;
    };
  }

  static authCode(fieldTitle: string, dictionaryService: DictionaryService) {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value || value === 'bolanishedh') {
        return null;
      }
      return {
        message:
          fieldTitle +
          ' ' +
          dictionaryService.getTranslationOrWord('is invalid.'),
      };
    };
  }
}

export function getCommonValidators(
  field: SortedFieldInfo<any, any>,
  dictionaryService: DictionaryService
): ValidatorFn[] {
  const validators = [];
  if (field.fieldType.toUpperCase() === 'TEXT') {
    const maxLength =
      field.maxLength && field.maxLength > 0 ? field.maxLength : 250;
    validators.push(OrbundValidators.maxLength(maxLength, dictionaryService));
  }
  if (
    field.fieldType.toUpperCase() === 'NUMBER' ||
    field.fieldType.toUpperCase() === 'DECIMAL'
  ) {
    const maxValue =
      field.maxLength &&
      field.maxLength > 0 &&
      field.maxLength < Number.MAX_SAFE_INTEGER
        ? field.maxLength
        : Number.MAX_SAFE_INTEGER;
    validators.push(OrbundValidators.maxValue(maxValue, dictionaryService));
    if (field.fieldType.toUpperCase() === 'NUMBER') {
      validators.push(
        OrbundValidators.positiveNumeric(field.fieldTitle, dictionaryService)
      );
    } else {
      validators.push(
        OrbundValidators.decimal(field.fieldTitle, dictionaryService)
      );
    }
  }
  if (field.fieldType.toUpperCase() === 'EMAIL') {
    validators.push(
      OrbundValidators.email(field.fieldTitle, dictionaryService)
    );
  }
  if (field.fieldType.toUpperCase() === 'PASSWORD') {
    const maxLength =
      field.maxLength && field.maxLength > 0 ? field.maxLength : 50;
    validators.push(OrbundValidators.maxLength(maxLength, dictionaryService));
  }

  return validators;
}
