import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ValidatorFn } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Subject, Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CartBasePage } from '../cart-base.page';
import { CartOptions, FieldInfo, Option } from '../models';
import { JsLibService } from '../service/js-lib.service';
import { ShoppingCartService } from '../service/shopping-cart.service';
import { RemoveAllFromCart, ShoppingCartState, UpdateThankYouPageResponse } from '../cart-states';
import { LSItemName } from '../util/constant';

declare var CayanCheckoutPlus: any;
var successCallback = function (tokenResponse: any) {};

@Component({
  templateUrl: './billing.page.html',
  styleUrls: ['./billing.page.scss'],
})
export class BillingPage extends CartBasePage implements OnInit, OnDestroy {
  private dead$: Subject<void> = new Subject();

  @Select(ShoppingCartState.cartOptions)
  cartOptions$!: Observable<CartOptions>;

  @Select(ShoppingCartState.regType)
  regType$!: Observable<number>;
  regType: number = 0;
  paymentMethod: string = '';
  instapago: boolean = false;

  profileFields: FieldInfo[] = [];
  paymentFields: FieldInfo[] = [];
  paymentMethodField!: FieldInfo;

  formGroup!: FormGroup;

  transactionCharge: number = 0;
  currencySign: string = '$';
  errorMessage: string = '';
  disblePaymentButton: boolean = false;
  stateOptions: Option<any, any>[] = [];
  hasStateField: boolean = false;

  constructor(
    route: ActivatedRoute,
    private router: Router,
    private shoppingCartService: ShoppingCartService,
    private cdRef: ChangeDetectorRef,
    private formBuilder: FormBuilder,
    private store: Store,
    private jsLibService: JsLibService
  ) {
    super(route, shoppingCartService);
    this.jsLibService.loadScript('cayanCredit');

    this.init();
    this.formGroup = this.formBuilder.group({});
  }

  ngOnDestroy(): void {
    this.dead$.next();
    this.dead$.complete();
  }

  ngOnInit(): void {
    this.cartOptions$.pipe(takeUntil(this.dead$)).subscribe((options) => {
      if (options) this.currencySign = options.currencySign;
    });

    this.regType$.pipe(takeUntil(this.dead$)).subscribe((regType) => {
      this.regType = regType;
      this.getBillingInfo();
    });
    successCallback = this.successCallback.bind(this);
  }

  getBillingInfo() {
    this.cartService.fetchBillingInfo(this.regType, this.paymentMethod).subscribe(
      (response) => {
        let controls: { [key: string]: FormControl } = {};
        if (response.profileFields) {
          this.initProfileFields(response.profileFields, controls);
        }
        if (response.paymentFields) {
          this.initPaymentFields(response.paymentFields, controls);
        }

        if (response.paymentMethodFieldInfo) {
          const required = [this.shoppingCartService.required(response.paymentMethodFieldInfo.fieldTitle)];
          controls[response.paymentMethodFieldInfo.fieldName] = new FormControl(
            response.paymentMethodFieldInfo.fieldValue,
            required
          );
        }
        this.formGroup = this.formBuilder.group(controls);
        this.paymentFields = response.paymentFields;
        this.profileFields = response.profileFields;
        this.paymentMethodField = response.paymentMethodFieldInfo;
        this.transactionCharge = response.transactionCharge;
        this.instapago = this.paymentMethodField.fieldValue === 'InstaPagoCard';
        this.cdRef.detectChanges();
      },
      (errors) => {
        this.handleError(errors);
      }
    );
  }

  onDropDownChange(value: any, fieldName: string) {
    if (fieldName === 'country' && this.hasStateField) {
      this.updateStateOptions(value);
    }
  }

  private initProfileFields(profileFields: FieldInfo[], controls: { [key: string]: FormControl }) {
    const length = profileFields.length;
    for (let i = 0; i < length; i++) {
      const field = profileFields[i];
      const validators = [];
      if (field.required) {
        validators.push(this.shoppingCartService.required(field.fieldTitle));
      }

      controls[field.fieldName] = new FormControl(field.fieldValue, validators);
      if (field.fieldName === 'state' && field.fieldType === 'DROPDOWN') {
        this.stateOptions = field.options;
        this.hasStateField = true;
      }
    }
  }

  private initPaymentFields(paymentFields: FieldInfo[], controls: { [key: string]: FormControl }) {
    const length = paymentFields.length;
    for (let i = 0; i < length; i++) {
      const field = paymentFields[i];
      const validators: ValidatorFn[] = [];

      if (field.fieldName === 'ccNumber') {
        validators.push(this.shoppingCartService.positiveNumber(15, 16));
      }
      if (field.fieldName === 'ccCode') {
        validators.push(this.shoppingCartService.positiveNumber(3, 4));
      }
      if (field.fieldName === 'cardHolderId') {
        validators.push(this.shoppingCartService.positiveNumber(6, 8));
      }
      if (field.fieldName === 'cardHolderName') {
        validators.push(this.shoppingCartService.letter());
      }

      if (field.required) {
        validators.push(this.shoppingCartService.required(field.fieldTitle));
      }
      if (field.fieldName === 'autoChargeAcknowledged') {
        validators[0] = this.shoppingCartService.checkboxRequired(
          'Auto Charge agreement is required for installment payment.'
        );
      }
      if (field.fieldName === 'purchaseOrderAcknowledged') {
        validators[0] = this.shoppingCartService.checkboxRequired('Purchase Order condition agreement is required.');
      }
      controls[field.fieldName] = new FormControl(field.fieldValue, validators);
    }
  }

  private updateStateOptions(countryCode: any) {
    this.cartService.fetchStates(countryCode).subscribe((field) => {
      this.stateOptions = field.options;
    });
  }

  onPaymentMethodChange(value: string) {
    this.paymentMethod = value;
    this.instapago = value === 'InstaPagoCard';
    this.getBillingInfo();
  }

  getCayanFieldName(fieldName: string) {
    switch (fieldName) {
      case 'ccNumber':
        return 'cardnumber';
      case 'ccExpMonth':
        return 'expirationmonth';
      case 'ccExpYear':
        return 'expirationyear';
      case 'ccCode':
        return 'cvv';
      default:
        return fieldName;
    }
  }

  isInvalid(fieldName: string): boolean {
    const control = this.formGroup.controls[fieldName];
    return control && (control.dirty || control.touched) && control.invalid;
  }

  getErrorMessage(fieldName: string): string | null {
    if (this.formGroup.controls[fieldName].errors) {
      return this.formGroup.controls[fieldName].errors!.message;
    }
    return null;
  }

  proceedPayment() {
    if (this.formGroup.invalid) {
      this.formGroup.markAllAsTouched();
      this.formGroup.updateValueAndValidity();
      return;
    }
    this.disblePaymentButton = true;
    const values = this.formGroup.value;
    values.regType = this.regType;
    const paymentMethod = values.paymentMethod;
    if (paymentMethod === 'CayanCredit') {
      this.processCayanCredit();
    } else {
      this.submitPayment();
    }
  }

  processCayanCredit() {
    this.cartService.fetchCayanWebApiKey().subscribe(
      (response) => {
        CayanCheckoutPlus.setWebApiKey(response.cayanWebApiKey);
        CayanCheckoutPlus.createPaymentToken({
          success: successCallback,
          error: this.failureCallback,
        });
      },
      (errors) => this.handleError(errors)
    );
  }

  successCallback(tokenResponse: any) {
    if (tokenResponse.token) {
      this.submitPayment(tokenResponse.token);
    } else {
      this.errorMessage = 'Something went wrong. Please try again.';
    }
  }

  failureCallback(errorResponses: { error_code: string; reason: string }[]) {
    var errorText = '';
    const length = errorResponses.length;

    for (let index = 0; index < length; index++) {
      const error = errorResponses[index];
      errorText += `error_code: ${error.error_code} reason: ${error.reason}<br/>`;
    }

    this.errorMessage = errorText;
  }

  public submitPayment(token: any = '') {
    const values = this.formGroup.value;
    values.regType = this.regType;
    values.paymentToken = token;
    this.cartService.processPayment(values).subscribe(
      (response) => {
        this.store.dispatch(new UpdateThankYouPageResponse(response)).subscribe((data) => {
          this.shoppingCartService.goToThankyouPage(this.router);
        });
      },
      (errors) => this.handleError(errors)
    );
  }

  handleError(errors: any) {
    this.disblePaymentButton = false;
    const error = errors.error.error;
    if (error.hasOwnProperty('error')) {
      const errorCode = error.error.code;
      const errorMessage = error.error.message;
      this.errorMessage = errorMessage;
      console.log(errorCode);

      if (errorCode === 605) {
        this.sessionExpired = true;
        this.store.dispatch(new RemoveAllFromCart());
        localStorage.removeItem(LSItemName.SCART_SELECTED_CLASS_IDS);
        localStorage.removeItem(LSItemName.SCART_REGISTRATION);
        localStorage.removeItem(LSItemName.SCART_CLASSID_PAYPLANID_MAP);
      }
    }
  }
}
