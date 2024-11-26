import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Select } from '@ngxs/store';
import { Subject, Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CartBasePage } from '../cart-base.page';
import { FieldInfo } from '../models';
import { ShoppingCartService } from '../service/shopping-cart.service';
import { ShoppingCartState } from '../cart-states';

@Component({
  templateUrl: './request-password.page.html',
  styleUrls: ['./request-password.page.scss'],
})
export class RequestPasswordPage extends CartBasePage implements OnInit, OnDestroy {
  private dead$ = new Subject<void>();
  @Select(ShoppingCartState.currentUserType)
  currentUserType$!: Observable<0 | 1 | 99>;
  currentUserType: 0 | 1 | 99 = 0;

  formGroup: FormGroup;
  errorMessage: string = '';
  userChooseFieldInfo!: FieldInfo;
  email: string = '';
  successMessage: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private shoppingCartService: ShoppingCartService,
    private router: Router,
    route: ActivatedRoute
  ) {
    super(route, shoppingCartService);
    this.init();

    this.formGroup = this.formBuilder.group({});
  }
  ngOnDestroy(): void {
    this.dead$.next();
    this.dead$.complete();
  }

  ngOnInit(): void {
    const title = this.shoppingCartService.translate('Email');
    const controls: { [key: string]: FormControl } = {
      email: new FormControl('', [this.shoppingCartService.required(title), this.shoppingCartService.email(title)]),
    };
    this.formGroup = this.formBuilder.group(controls);
    this.currentUserType$.pipe(takeUntil(this.dead$)).subscribe((userType) => {
      this.currentUserType = userType;
    });
  }

  isInvalid(fieldName: string): boolean {
    const control = this.formGroup.controls[fieldName];
    return control && (control.dirty || control.touched) && control.invalid;
  }
  getErrorMessage(fieldName: string): string | null {
    const control = this.formGroup.controls[fieldName];
    if (control && control.errors) {
      return control.errors!.message;
    }
    return null;
  }
  requestPassword() {
    this.errorMessage = '';
    if (this.formGroup.invalid) {
      this.formGroup.markAllAsTouched();
      return;
    }

    const payload = this.createPayload();

    if (this.currentUserType === 1 || this.currentUserType === 99) {
      this.shoppingCartService.requestPassword(payload, this.currentUserType).subscribe(
        (response) => {
          if (response.fieldInfo) {
            this.createMultipleUserFormGroup(response.fieldInfo);
          } else {
            this.successMessage = response.message;
          }
        },
        (errors) => this.handleError(errors)
      );
    }
  }

  createMultipleUserFormGroup(fieldInfo: FieldInfo) {
    this.userChooseFieldInfo = fieldInfo;
    const controls: { [key: string]: FormControl } = {};
    controls[this.userChooseFieldInfo.fieldName] = new FormControl(
      null,
      this.shoppingCartService.required(this.userChooseFieldInfo.fieldTitle)
    );
    this.formGroup = this.formBuilder.group(controls);
  }

  createPayload() {
    const payload = this.formGroup.value;
    if (!payload.hasOwnProperty('email')) {
      payload['email'] = this.email;
    } else {
      this.email = payload['email'];
    }
    console.log('payload: ', payload);
    return payload;
  }

  handleError(errors: any) {
    const error = errors.error.error;
    if (error.hasOwnProperty('error')) {
      const errorCode = error.error.code;
      const errorMessage = error.error.message;
      this.errorMessage = errorMessage;
    }
  }

  backToRgistrationPage() {
    this.shoppingCartService.goRegistrationPage(this.router);
  }
}
