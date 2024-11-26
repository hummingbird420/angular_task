import { Component, DoCheck, ElementRef, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDateFormats, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatDialogContent, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Select, Store } from '@ngxs/store';
import { Subject, Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CartOptions, ContactStudentResponse, FieldSectionInfo } from '../models';
import { ShoppingCartService } from '../service/shopping-cart.service';
import { ShoppingCartState, UpdateGroupStudentFields } from '../cart-states';

@Component({
  templateUrl: './add-students.dialog.html',
  styleUrls: ['./add-students.dialog.scss'],
})
export class AddStudentsDialog implements OnInit, OnDestroy, DoCheck {
  private dead$ = new Subject<void>();
  @Select(ShoppingCartState.cartOptions)
  cartOptions$!: Observable<CartOptions>;

  @Select(ShoppingCartState.currentUserType)
  currentUserType$!: Observable<0 | 1 | 99>;
  currentUserType: 0 | 1 | 99 = 0;

  @Select(ShoppingCartState.groupStudentFields)
  groupStudentFields$!: Observable<FieldSectionInfo[]>;
  fieldSections: FieldSectionInfo[] = [];
  formGroup: FormGroup;
  errorMessage: string = '';
  contactStudentResponse: ContactStudentResponse = {} as ContactStudentResponse;
  dateFieldNames: string[] = [];
  minDate: Date;
  maxDate: Date;
  makeStudentEmailAsUsername: boolean = false;
  dateFormat: string = 'M/D/YYYY';
  hasApiError: boolean = false;

  @ViewChild('dialogContent') private dialogContent!: ElementRef<any>;

  constructor(
    private shoppingCartService: ShoppingCartService,
    private formBuilder: FormBuilder,
    private store: Store,
    private dialogRef: MatDialogRef<AddStudentsDialog, ContactStudentResponse>,
    @Inject(MAT_DATE_FORMATS) private dateFormats: MatDateFormats,
    @Inject(MAT_DIALOG_DATA) public dialogInfo: any
  ) {
    this.formGroup = this.formBuilder.group({});
    this.shoppingCartService.fetchTranslatedWords(['Add Student', 'Add', 'Cancel']);
    this.dateFormats.display.dateInput = 'M/D/yyyy';
    this.dateFormats.parse.dateInput = 'M/d/yyyy';
    const currentYear = new Date().getFullYear();
    this.minDate = new Date(currentYear - 10, 0, 2);
    this.maxDate = new Date(currentYear + 10, 12);
  }
  ngDoCheck(): void {
    if (this.dialogContent && this.errorMessage && this.hasApiError) {
      this.dialogContent.nativeElement.scrollTop = this.dialogContent.nativeElement.scrollHeight;
      setTimeout(() => {
        this.hasApiError = false;
      }, 40);
    }
  }
  ngOnDestroy(): void {
    this.dead$.next();
    this.dead$.complete();
  }

  ngOnInit(): void {
    this.currentUserType$.pipe(takeUntil(this.dead$)).subscribe((userType) => {
      this.currentUserType = userType;
    });
    this.cartOptions$.pipe(takeUntil(this.dead$)).subscribe((options) => {
      if (options) {
        const dateFormat: string = options.dateFormat;
        if (dateFormat) {
          this.dateFormats.display.dateInput = dateFormat.toUpperCase();
          this.dateFormats.parse.dateInput = dateFormat.toUpperCase();
          this.dateFormat = dateFormat.toUpperCase();
        }
        this.makeStudentEmailAsUsername = options.makeStudentEmailAsUsername;
      }
    });
    this.groupStudentFields$
      .pipe(takeUntil(this.dead$))
      .subscribe((fieldSections) => this.initFormGroup(fieldSections));
    this.shoppingCartService.fetchGroupStudentFields().subscribe((fieldSections) => {
      this.store.dispatch(new UpdateGroupStudentFields(fieldSections));
    });
  }

  initFormGroup(fieldSections: FieldSectionInfo[]) {
    let controls: { [key: string]: FormControl } = {};
    for (let i = 0; i < fieldSections.length; i++) {
      const fields = fieldSections[i].fields;
      for (let index = 0; index < fields.length; index++) {
        const field = fields[index];
        let fieldValue = field.fieldValue;
        const fieldType = field.fieldType.toUpperCase();
        const fieldName = field.fieldName;

        if (fieldName === null || fieldName === undefined || fieldName === '') {
          continue;
        }

        const validators = [];
        const asyncValidators = [];

        if (field.required) {
          validators.push(this.shoppingCartService.required(field.fieldTitle));
        }

        if (fieldName === 'username') {
          asyncValidators.push(this.shoppingCartService.asyncUsername(this.currentUserType));
        }

        if (fieldType === 'EMAIL') {
          validators.push(this.shoppingCartService.email(field.fieldTitle));
        }

        if (fieldType === 'NUMBER') {
          fieldValue = String(fieldValue).trim();
          validators.push(this.shoppingCartService.number());
        }

        if (fieldType === 'PASSWORD') {
          validators.push(this.shoppingCartService.password());
        }

        if (fieldType === 'DATE') {
          fieldValue = String(fieldValue).trim();
          this.dateFieldNames.push(field.fieldName);
        }

        if (fieldName.startsWith('XP')) {
          fieldValue = String(fieldValue).trim();
        }
        if (asyncValidators.length) {
          controls[fieldName] = new FormControl(fieldValue, {
            validators: validators,
            asyncValidators: asyncValidators,
            updateOn: 'blur',
          });
        } else {
          controls[fieldName] = new FormControl(fieldValue, validators);
        }
      }
    }

    this.fieldSections = fieldSections;
    this.formGroup = this.formBuilder.group(controls);
  }
  getMinDate(fieldName: string) {
    if (fieldName === 'dateOfBirth') {
      const currentYear = new Date().getFullYear();
      return new Date(currentYear - 50, 0, 2);
    } else {
      return this.minDate;
    }
  }
  getMaxDate(fieldName: string) {
    if (fieldName === 'dateOfBirth') {
      return new Date();
    } else {
      return this.maxDate;
    }
  }

  isInvalid(fieldName: string): boolean {
    const control = this.formGroup.controls[fieldName];
    return control && (control.dirty || control.touched) && control.invalid;
  }

  getErrorMessage(fieldName: string): string | null {
    const control = this.formGroup.controls[fieldName];
    if (control && control.errors) {
      const errors = control.errors;

      const inValidDate = errors.matDatepickerParse || errors.matDatepickerMax || errors.matDatepickerMin;
      if (inValidDate) {
        return this.shoppingCartService.translate('Invalid date.');
      }

      const message = errors.message;
      if (message) return message;
    }

    return null;
  }

  createStudent() {
    this.errorMessage = '';
    if (this.formGroup.invalid) {
      this.formGroup.markAllAsTouched();
      this.formGroup.updateValueAndValidity();
      return;
    }
    const payload = this.constructPayload();

    this.shoppingCartService.saveGroupStudent(payload).subscribe(
      (response) => {
        this.contactStudentResponse = response;
        this.dialogRef.close(response);
      },
      (errors) => {
        const error = errors.error.error;
        if (error.hasOwnProperty('error')) {
          const errorCode = error.error.code;
          const errorMessage = error.error.message;
          this.errorMessage = errorMessage;
          this.hasApiError = true;
        }
      }
    );
  }

  constructPayload() {
    let formValues = this.formGroup.value;

    const payload: any = {};
    const pv: any = {};
    for (let key of Object.keys(formValues)) {
      let value = formValues[key];
      if (value === null || value === undefined) {
        value = '';
      }

      if (key.startsWith('XP')) {
        if (this.dateFieldNames.includes(key) && typeof value !== 'string') {
          value = value.format('yyyy-MM-DD');
        }
        pv[key] = value;
      } else if (key === 'dateOfBirth') {
        if (typeof value !== 'string') {
          value = value.format('yyyy-MM-DD');
        }
        payload[key] = value;
      } else {
        payload[key] = value;
      }
    }

    payload.profileFieldValues = pv;
    return payload;
  }
}
