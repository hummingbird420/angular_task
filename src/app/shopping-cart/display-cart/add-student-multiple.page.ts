import { BreakpointObserver } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatDateFormats, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Select, Store } from '@ngxs/store';
import * as moment from 'moment';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CartOptions, MADisplayCartStudentInfo } from '../models';
import { ShoppingCartService } from '../service/shopping-cart.service';
import { ShoppingCartState, UpdateMADisplayCartStudents } from '../cart-states';

@Component({
  templateUrl: './add-student-multiple.page.html',
  styleUrls: ['./add-student-multiple.page.scss'],
})
export class AddStudentMultiplePage implements OnInit, OnDestroy {
  private dead$ = new Subject<void>();

  @Select(ShoppingCartState.cartOptions)
  cartOptions$!: Observable<CartOptions>;

  @Select(ShoppingCartState.maDisplayCartStudents)
  maDisplayCartStudents$!: Observable<MADisplayCartStudentInfo[]>;
  exFormGroup: FormGroup;
  exStudentMap: { [key: string]: MADisplayCartStudentInfo } = {};
  exErrors: { [key: string]: string | null } = {};

  maDisplayCartStudents: MADisplayCartStudentInfo[] = [];
  formGroups: FormGroup[] = [];

  errorMessage: string = '';
  isMobile: boolean = false;
  minDate: Date;
  maxDate: Date;
  makeStudentEmailAsUsername: boolean = false;
  dateFormat: string = 'M/D/YYYY';

  constructor(
    private shoppingCartService: ShoppingCartService,
    private formBuilder: FormBuilder,
    private store: Store,
    private cdRef: ChangeDetectorRef,
    private breakpointObserver: BreakpointObserver,
    private dialogRef: MatDialogRef<AddStudentMultiplePage, boolean>,
    @Inject(MAT_DATE_FORMATS) private dateFormats: MatDateFormats,
    @Inject(MAT_DIALOG_DATA) public dialogInfo: any
  ) {
    this.exFormGroup = this.formBuilder.group({});
    this.dateFormats.display.dateInput = 'M/D/yyyy';
    this.dateFormats.parse.dateInput = 'M/D/yyyy';
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    let minimumAge = this.dialogInfo.minimumAge;
    if (!minimumAge) minimumAge = 0;
    const minAgeInMillis = minimumAge * 365 * 24 * 60 * 60 * 1000;

    this.minDate = new Date(currentYear - minimumAge - 50, 0, 2);
    this.maxDate = new Date(currentDate.getTime() - minAgeInMillis);
  }

  ngOnDestroy(): void {
    this.dead$.next();
    this.dead$.complete();
  }

  ngOnInit(): void {
    this.maDisplayCartStudents$.pipe(takeUntil(this.dead$)).subscribe((students) => {
      this.maDisplayCartStudents = students;

      const controls: { [key: string]: FormControl } = {};
      this.maDisplayCartStudents.map((student) => {
        controls['exstudent' + student.index] = new FormControl(student.classIds.includes(this.dialogInfo.classId));
        this.exStudentMap['exstudent' + student.index] = student;
      });
      this.exFormGroup = this.formBuilder.group(controls);
    });
    this.onViewChange();
    this.cartOptions$.pipe(takeUntil(this.dead$)).subscribe((options) => {
      if (options) {
        let dateFormat: string = options.dateFormat;
        this.dateFormats.display.dateInput = dateFormat.toUpperCase();
        this.dateFormats.parse.dateInput = dateFormat.toUpperCase();
        this.dateFormat = dateFormat.toUpperCase();
        this.makeStudentEmailAsUsername = options.makeStudentEmailAsUsername;
        this.cdRef.detectChanges();
      }
    });
    this.addFormGroup();
  }

  onViewChange() {
    this.breakpointObserver
      .observe(['(max-width: 799px)'])
      .pipe(takeUntil(this.dead$))
      .subscribe((result) => {
        if (result.matches) {
          this.isMobile = true;
        } else {
          this.isMobile = false;
        }

        this.cdRef.detectChanges();
      });
  }

  addFormGroup() {
    const controls: { [key: string]: FormControl } = {};
    controls['firstName'] = new FormControl('', [
      this.shoppingCartService.required(this.shoppingCartService.translate('First Name')),
    ]);
    controls['lastName'] = new FormControl('', [
      this.shoppingCartService.required(this.shoppingCartService.translate('Last Name')),
    ]);
    controls['dateOfBirth'] = new FormControl('', {
      validators: this.shoppingCartService.required(this.shoppingCartService.translate('Date of Birth')),
      asyncValidators: this.shoppingCartService.asyncMinimumAge(this.dialogInfo.minimumAge),
      updateOn: 'blur',
    });
    const validators = [this.shoppingCartService.email(this.shoppingCartService.translate('Email'))];
    const asyncValidators = [];
    if (this.makeStudentEmailAsUsername) {
      validators.push(this.shoppingCartService.required(this.shoppingCartService.translate('Email')));
      const exEmails = this.maDisplayCartStudents.map((student) => student.email);
      asyncValidators.push(this.shoppingCartService.asyncEmailMultiple(exEmails, this.formGroups));
    }

    controls['email'] = new FormControl('', {
      validators: validators,
      asyncValidators: asyncValidators,
      updateOn: 'blur',
    });

    this.formGroups.push(this.formBuilder.group(controls));
  }

  getDate(value: string) {
    return moment(value).format(this.dateFormats.display.dateInput);
  }

  isInvalid(fieldName: string, index: number): boolean {
    const control = this.formGroups[index].controls[fieldName];
    return control && (control.dirty || control.touched) && control.invalid;
  }

  getErrorMessage(fieldName: string, index: number): string | null {
    const control = this.formGroups[index].controls[fieldName];
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

  getExErrorMessage(fieldName: string) {
    return this.exErrors[fieldName];
  }

  addStudents() {
    this.errorMessage = '';
    const values: MADisplayCartStudentInfo[] = [];
    const exStudents = this.exFormGroup.value;
    for (const key of Object.keys(exStudents)) {
      if (exStudents[key]) {
        const exStudent = this.exStudentMap[key];
        const classIds = exStudent.classIds.map((id) => id);
        if (!exStudent.classIds.includes(this.dialogInfo.classId)) {
          classIds.push(this.dialogInfo.classId);
        }
        const updatedStudent: MADisplayCartStudentInfo = {
          firstName: exStudent.firstName,
          lastName: exStudent.lastName,
          dateOfBirth: exStudent.dateOfBirth,
          email: exStudent.email,
          index: exStudent.index,
          classIds: classIds,
        };

        values.push(updatedStudent);
      }
    }

    this.formGroups.map((formGroup, index) => {
      if (formGroup.valid) {
        const value = formGroup.value;
        let dateOfBirth = value.dateOfBirth;
        if (typeof dateOfBirth !== 'string') {
          dateOfBirth = dateOfBirth.format('yyyy-MM-DD');
        }
        value.dateOfBirth = dateOfBirth;
        value.classIds = [this.dialogInfo.classId];
        values.push(value);
      }
    });
    if (values.length === 0) {
      this.errorMessage = this.shoppingCartService.translate('Please add at least one student.');
      return;
    }

    this.store.dispatch([new UpdateMADisplayCartStudents(values)]).subscribe(() => {
      this.dialogRef.close(true);
    });
  }

  validateStudent(event: MatCheckboxChange, student: MADisplayCartStudentInfo) {
    const name = event.source.name;
    if (event.checked) {
      if (name) {
        this.shoppingCartService.getAge(student.dateOfBirth).subscribe((response) => {
          let minimumAge = this.dialogInfo.minimumAge;
          if (!minimumAge) minimumAge = 0;
          if (minimumAge > 0 && response.age < minimumAge) {
            const part1 = this.shoppingCartService.translate('Student must be');
            const part2 = this.shoppingCartService.translate('years old to attend this class.');
            this.exErrors[name] = `${part1} ${minimumAge} ${part2}`;
            this.exFormGroup.controls[name].setValue(false, {
              onlySelf: false,
            });
          }
        });
      }
    } else {
      if (name) this.exErrors[name] = '';
    }
  }
}
