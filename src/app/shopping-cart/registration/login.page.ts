import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { AuthService } from 'src/app/services';
import { CartBasePage } from '../cart-base.page';
import { ShoppingCartService } from '../service/shopping-cart.service';
import {
  ShoppingCartState,
  UpdateContactRegistration,
  UpdateGroupStudentFields,
  CartFilterState,
  RemoveAllFromCart,
} from '../cart-states';
import { LSItemName } from '../util/constant';

@Component({
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage extends CartBasePage implements OnInit {
  @Select(CartFilterState.allSelectedFilter)
  allSelectedFilter$!: Observable<any>;

  @Select(ShoppingCartState.currentUserType)
  currentUserType$!: Observable<0 | 1 | 99>;
  currentUserType: 0 | 1 | 99 = 0;

  selectedLevelId: number = -1;
  selectedProgramId: number = -1;
  selectedProgramLevelId: number = -1;

  formGroup: FormGroup;

  isLoginFailed: boolean = false;
  errorMessage: string = '';

  constructor(
    private router: Router,
    route: ActivatedRoute,
    private shoppingCartService: ShoppingCartService,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private store: Store
  ) {
    super(route, shoppingCartService);

    this.init();
    this.formGroup = this.formBuilder.group({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit(): void {
    this.currentUserType$.pipe(take(1)).subscribe((userType) => {
      this.currentUserType = userType;
      if (!this.currentUserType) {
        this.shoppingCartService.goRegistrationPage(this.router);
      }
    });

    this.allSelectedFilter$.pipe(take(1)).subscribe((filters) => {
      this.selectedLevelId = filters.selectedDepartment;
      this.selectedProgramId = filters.selectedProgram;
      this.selectedProgramLevelId = filters.selectedProgramLevel;
    });
  }

  createAccount() {
    this.shoppingCartService.goCreateAccountPage(this.router);
  }
  requestPassword() {
    this.shoppingCartService.goToRequestPasswordPage(this.router);
  }
  isInvalid(fieldName: string): boolean {
    const control = this.formGroup.controls[fieldName];
    return (control.dirty || control.touched) && control.invalid;
  }

  login() {
    if (this.formGroup.invalid) {
      this.formGroup.markAllAsTouched();
      return;
    }
    const formValues = this.formGroup.value;
    console.log(formValues);

    if (this.currentUserType == 1) {
      this.shoppingCartService.login(formValues).subscribe(
        (response) => {
          this.shoppingCartService.goToUpdateStudentPage(this.router);
        },
        (error) => {
          this.formGroup.markAsPristine();
          this.formGroup.markAllAsTouched();
          this.isLoginFailed = true;
        }
      );
      return;
    }

    if (this.currentUserType == 99) {
      this.shoppingCartService.loginContact(formValues).subscribe(
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
        (error) => {
          this.formGroup.markAsPristine();
          this.formGroup.markAllAsTouched();
          this.isLoginFailed = true;
        }
      );
    }
  }

  credentials(): { username: string; password: string; roleId: number } {
    const username = this.formGroup.controls.username.value;
    const password = this.formGroup.controls.password.value;
    const roleId = this.shoppingCartService.currentUserType;
    return { username: username, password: password, roleId: roleId };
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
