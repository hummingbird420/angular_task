import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { CartBasePage } from '../cart-base.page';
import { FieldInfo } from '../models';
import { ShoppingCartService } from '../service/shopping-cart.service';
import {
  RemoveAllFromCart,
  ShoppingCartState,
  UpdateContactRegistration,
  UpdateSingleStudentInfo,
  UpdateStudentRegistration,
} from '../cart-states';
import { LSItemName } from '../util/constant';
@Component({
  templateUrl: './update-student.page.html',
  styleUrls: ['./update-student.page.scss'],
})
export class UpdateStudentPage extends CartBasePage implements OnInit {
  @Select(ShoppingCartState.currentUserType)
  currentUserType$!: Observable<0 | 1 | 99>;
  currentUserType: 0 | 1 | 99 = 0;

  formGroup!: FormGroup;
  fields: FieldInfo[] = [];

  @Select(ShoppingCartState.selectedClassIds)
  selectedClassIds$!: Observable<(multiple: boolean) => number[]>;
  selectedClassIds: number[] = [];

  @Select(ShoppingCartState.couponCode)
  couponCode$!: Observable<string>;
  couponCode: string | null = null;

  errorMessage: string = '';
  showBackToClassButton: boolean = false;

  constructor(
    private router: Router,
    route: ActivatedRoute,
    private shoppingCartService: ShoppingCartService,
    private formBuilder: FormBuilder,
    private store: Store
  ) {
    super(route, shoppingCartService);
    this.init();
  }

  ngOnInit(): void {
    this.selectedClassIds$
      .pipe(take(1))
      .pipe(map((fn) => fn(this.multiple)))
      .subscribe((ids) => (this.selectedClassIds = ids));
    this.couponCode$.pipe(take(1)).subscribe((couponCode) => (this.couponCode = couponCode));
    this.currentUserType$.pipe(take(1)).subscribe((userType) => {
      this.currentUserType = userType;
      if (this.currentUserType !== 1) {
        this.shoppingCartService.goRegistrationPage(this.router);
      } else {
        this.shoppingCartService.updatableStudentFields$.subscribe((fields) => {
          let controls: { [key: string]: FormControl } = {};
          for (let index = 0; index < fields.length; index++) {
            const field = fields[index];
            const validators = [];
            if (field.required) {
              validators.push(this.shoppingCartService.required(field.fieldTitle));
            }

            if (field.fieldType.toUpperCase() === 'EMAIL') {
              validators.push(this.shoppingCartService.email(field.fieldTitle));
            }

            controls[field.fieldName] = new FormControl(field.fieldValue, validators);
          }
          this.fields = fields;
          this.formGroup = this.formBuilder.group(controls);
        });
      }
    });
  }

  isInvalid(fieldName: string): boolean {
    const control = this.formGroup.controls[fieldName];
    return (control.dirty || control.touched) && control.invalid;
  }

  getErrorMessage(fieldName: string): string | null {
    if (this.formGroup.controls[fieldName].errors) {
      return this.formGroup.controls[fieldName].errors!.message;
    }
    return null;
  }

  updateStudent() {
    if (this.formGroup.invalid) {
      this.formGroup.markAllAsTouched();
      this.formGroup.updateValueAndValidity();
      return;
    }

    let formValues = this.formGroup.value;
    formValues['classIds'] = this.selectedClassIds;
    formValues['couponCode'] = this.couponCode || '';
    console.log(formValues);

    this.shoppingCartService.updatableStudentInfo(formValues).subscribe(
      (response) => {
        console.log(response);
        if (response.alreadyEnrolled) {
          this.errorMessage = response.message;
          this.showBackToClassButton = true;
          this.store.dispatch([new UpdateStudentRegistration(0, 0), new UpdateContactRegistration(0)]);
        } else if (response.multipleStudentFound) {
          this.shoppingCartService.goRegistrationPage(this.router);
        } else {
          this.store
            .dispatch([new UpdateStudentRegistration(1, response.studentId), new UpdateSingleStudentInfo(formValues)])
            .subscribe(() => this.cartService.goToCheckoutPage(this.router));
        }
      },
      (errors) => this.handleError(errors)
    );
  }

  private handleError(errors: any) {
    const error = errors.error.error;
    if (error.hasOwnProperty('error')) {
      const errorCode = error.error.code;
      const errorMessage = error.error.message;
      this.errorMessage = errorMessage;
      console.log(errorCode);

      if (errorCode === 605) {
        this.store.dispatch(new RemoveAllFromCart());
        localStorage.removeItem(LSItemName.SCART_SELECTED_CLASS_IDS);
        localStorage.removeItem(LSItemName.SCART_REGISTRATION);
        localStorage.removeItem(LSItemName.SCART_CLASSID_PAYPLANID_MAP);
      }
    }
  }
}
