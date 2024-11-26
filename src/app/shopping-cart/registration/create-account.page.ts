import { ChangeDetectorRef, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDateFormats, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Observable, of, Subject } from 'rxjs';
import { map, take, takeUntil } from 'rxjs/operators';
import { CartBasePage } from '../cart-base.page';
import { CartOptions, FieldSectionInfo, MADisplayCartStudentInfo } from '../models';
import { ShoppingCartService } from '../service/shopping-cart.service';
import {
  FetchCartOptions,
  ShoppingCartState,
  UpdateContactRegistration,
  UpdateGroupStudentFields,
  UpdateStudentRegistration,
  CartFilterState,
  CartFilterStateModel,
} from '../cart-states';
import { ConfirmResetPasswordDialog } from './confirm-reset-password.dialog';

@Component({
  templateUrl: './create-account.page.html',
  styleUrls: ['./create-account.page.scss'],
})
export class CreateAccountPage extends CartBasePage implements OnInit, OnDestroy {
  @Select(ShoppingCartState.cartOptions)
  cartOptions$!: Observable<CartOptions>;

  @Select(CartFilterState.allSelectedFilter)
  allSelectedFilter$!: Observable<any>;

  @Select(ShoppingCartState.maDisplayCartStudents)
  maDisplayCartStudents$!: Observable<MADisplayCartStudentInfo[]>;
  maSingleStudentInfo!: MADisplayCartStudentInfo;

  @Select(ShoppingCartState.currentUserType)
  currentUserType$!: Observable<0 | 1 | 99>;
  currentUserType: 0 | 1 | 99 = 0;

  selectedLevelId: number = -1;
  selectedProgramId: number = -1;
  selectedProgramLevelId: number = -1;

  formGroup: FormGroup = this.formBuilder.group({});
  fieldSections: FieldSectionInfo[] = [];

  private dead$: Subject<void> = new Subject<void>();

  @Select(ShoppingCartState.selectedClassIds)
  selectedClassIds$!: Observable<(multiple: boolean) => number[]>;
  selectedClassIds: number[] = [];

  errorMessage: string = '';
  dateFieldNames: string[] = [];
  makeStudentEmailAsUsername: boolean = false;
  minDate: Date;
  maxDate: Date;
  dateFormat: string = 'M/D/yyyy';

  constructor(
    private router: Router,
    route: ActivatedRoute,
    private shoppingCartService: ShoppingCartService,
    private formBuilder: FormBuilder,
    private store: Store,
    private cdRef: ChangeDetectorRef,
    public dialog: MatDialog,
    @Inject(MAT_DATE_FORMATS) private dateFormats: MatDateFormats
  ) {
    super(route, shoppingCartService);
    this.init();
    this.dateFormats.display.dateInput = 'M/D/yyyy';
    this.dateFormats.parse.dateInput = 'M/D/yyyy';
    const currentYear = new Date().getFullYear();
    this.minDate = new Date(currentYear - 10, 0, 2);
    this.maxDate = new Date(currentYear + 10, 12);
  }
  ngOnDestroy(): void {
    this.dead$.next();
    this.dead$.complete();
  }

  ngOnInit(): void {
    this.cartOptions$.pipe(takeUntil(this.dead$)).subscribe((options) => {
      if (options) {
        let dateFormat: string = options.dateFormat;
        if (dateFormat) {
          this.dateFormats.display.dateInput = dateFormat.toUpperCase();
          this.dateFormats.parse.dateInput = dateFormat.toUpperCase();
          this.dateFormat = dateFormat.toUpperCase();
          this.cdRef.detectChanges();
        }
        this.makeStudentEmailAsUsername = options.makeStudentEmailAsUsername;
      } else {
        this.store.dispatch(new FetchCartOptions());
      }
    });
    this.selectedClassIds$
      .pipe(takeUntil(this.dead$))
      .pipe(map((fn) => fn(this.multiple)))
      .subscribe((classIds) => (this.selectedClassIds = classIds));

    this.currentUserType$.pipe(takeUntil(this.dead$)).subscribe((userType) => {
      this.currentUserType = userType;
      if (!this.currentUserType) {
        this.shoppingCartService.goRegistrationPage(this.router);
      } else if (this.currentUserType == 1) {
        this.maDisplayCartStudents$.pipe(take(1)).subscribe((students) => {
          this.shoppingCartService
            .getStudentFields()
            .pipe(take(1))
            .subscribe(
              (fieldSections) => {
                this.initFormGroup(fieldSections);
                if (this.shoppingCartService.multiple && students.length) {
                  this.updateMASingleStudentInfo(students[0]);
                }
              },
              (errors) => this.handleError(errors)
            );
        });
      } else if (this.currentUserType == 99) {
        this.shoppingCartService
          .getContactFields()
          .pipe(take(1))
          .subscribe(
            (fieldSections) => {
              this.initFormGroup(fieldSections);
            },
            (errors) => this.handleError(errors)
          );
      }
    });
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
  updateMASingleStudentInfo(studentInfo: MADisplayCartStudentInfo) {
    if (!studentInfo) return;
    const options = { onlySelf: true };
    const firstName = studentInfo.firstName || '';
    const lastName = studentInfo.lastName || '';
    const email = studentInfo.email || '';
    const dateOfBirth = studentInfo.dateOfBirth || '';

    this.formGroup.controls['firstName']?.setValue(firstName, options);
    this.formGroup.controls['lastName']?.setValue(lastName, options);
    this.formGroup.controls['email']?.setValue(email, options);
    this.formGroup.controls['dateOfBirth']?.setValue(dateOfBirth, options);
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
    this.allSelectedFilter$.pipe(takeUntil(this.dead$)).subscribe((filters: CartFilterStateModel) => {
      if (filters.selectedDepartment) {
        this.selectedLevelId = filters.selectedDepartment;
      }
      if (filters.selectedProgram) {
        this.selectedProgramId = filters.selectedProgram;
      }
      if (filters.selectedProgramLevel) {
        this.selectedProgramLevelId = filters.selectedProgramLevel;
      }
    });
    this.fieldSections = fieldSections;
    this.formGroup = this.formBuilder.group(controls);
  }

  login() {
    this.shoppingCartService.goLoginPage(this.router);
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

  handleError(errors: any) {
    const error = errors.error.error;
    if (error.hasOwnProperty('error')) {
      const errorCode = error.error.code;
      const errorMessage = error.error.message;
      this.errorMessage = errorMessage;
    }
  }

  createAccount() {
    if (this.formGroup.invalid) {
      this.formGroup.markAllAsTouched();
      this.formGroup.updateValueAndValidity();
      return;
    }

    if (this.currentUserType === 1) {
      if (this.validateUsername()) {
        this.validateEmail().subscribe((response) => {
          if (response.isExist) {
            this.confirmResetPassword();
          } else {
            this.createStudent();
          }
        });
      }
      return;
    }

    if (this.currentUserType === 99) {
      this.validateEmail().subscribe(
        (response) => {
          if (response.isExist) {
            this.confirmResetPassword();
          } else {
            this.createContact();
          }
        },
        (errors) => this.handleError(errors)
      );
    }
  }

  confirmResetPassword() {
    const options = {
      width: '400px',
      disableClose: true,
      closeOnNavigation: true,
      autoFocus: false,
      data: {},
    };
    this.dialog.open(ConfirmResetPasswordDialog, options);
  }

  validateUsername() {
    if (this.makeStudentEmailAsUsername) {
      const values = this.formGroup.value;
      const username = values.username;
      const email = values.email;
      const regex: RegExp = new RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.[a-zA-Z]{2,6})+$/gi);
      if (String(username).match(regex) === null) {
        this.errorMessage = this.shoppingCartService.translate('Username should be email address.');
        return false;
      }

      if (username != email) {
        this.errorMessage = this.shoppingCartService.translate('Username and email address must be same.');
        return false;
      }
    }
    return true;
  }

  validateEmail() {
    const values = this.formGroup.value;
    const email = values.email;
    if (this.currentUserType === 1) return this.shoppingCartService.checkStudentEmailExist(email);
    if (this.currentUserType === 99) return this.shoppingCartService.checkContactEmailExist(email);

    return of({ isExist: false });
  }

  createStudent() {
    let formValues = this.constructPayload();
    formValues.classIds = this.selectedClassIds;
    formValues.couponCode = this.shoppingCartService.couponCode;
    this.shoppingCartService.registerStudent(formValues).subscribe(
      (response) => {
        this.store.dispatch(new UpdateStudentRegistration(1, response.studentId));
        this.shoppingCartService.goToCheckoutPage(this.router);
      },
      (errors) => this.handleError(errors)
    );
  }

  createContact() {
    const payload: any = this.constructPayload();

    this.shoppingCartService.registerContact(payload).subscribe(
      (response) => {
        const actions: any = [new UpdateContactRegistration(2)];

        if (this.multiple === true) {
          const payload = {
            levelId: this.selectedLevelId,
            programId: this.selectedProgramId,
            programLevelId: this.selectedProgramLevelId,
          };

          this.shoppingCartService.saveGroupEnrollment(payload).subscribe(
            (response) => {
              this.store.dispatch(actions).subscribe((data) => {
                this.shoppingCartService.goToCheckoutPage(this.router);
              });
            },
            (errors) => this.handleError(errors)
          );
        } else {
          actions.push(new UpdateGroupStudentFields(response));
          this.store.dispatch(actions).subscribe((data) => {
            this.shoppingCartService.goToGroupRegisterPage(this.router);
          });
        }
      },
      (errors) => this.handleError(errors)
    );
  }

  constructPayload() {
    let formValues = this.formGroup.value;
    const payload: any = {};
    const pv: any = {};
    for (var key of Object.keys(formValues)) {
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
