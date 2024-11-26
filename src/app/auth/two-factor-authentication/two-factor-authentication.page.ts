import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first, map } from 'rxjs/operators';
import { ERROR_CODE } from 'src/app/constants/api-error-code';
import { ROUTE_URL } from 'src/app/constants/route-url';
import { AlertService, AuthService } from 'src/app/services';
import { OrbundValidators } from 'src/app/util';

@Component({
  selector: 'o-two-factor-authentication',
  templateUrl: './two-factor-authentication.page.html',
  styleUrls: ['./two-factor-authentication.page.scss'],
})
export class TwoFactorAuthenticationPage implements OnInit {
  schoolName: string;
  logo: string;
  twoFactorAuthenticationForm: FormGroup;
  returnUrl: string;
  email: string = '';
  phone: string = '';
  studentData: any;
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private alertSevice: AlertService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.schoolName = "Bene's Career Academy";
    this.logo = './assets/images/logo_blue.png';
    this.twoFactorAuthenticationForm = this.formBuilder.group({
      otp: new FormControl('', [Validators.required]),
    });
    this.studentData = this.router?.getCurrentNavigation()?.extras.state;
    this.returnUrl = '/dashboard';
  }

  ngOnInit(): void {
    if (this.studentData) {
      const authData = JSON.parse(this.studentData.data);
      if (authData.hasOwnProperty('email')) {
        const splitMail = authData.email.split('@');
        const domain = splitMail[1];
        this.email = splitMail[0]
          .substring(0, 3)
          .concat(Array(splitMail[0].length - 3).join('*'))
          .concat('@')
          .concat(domain);
      }
      if (authData.hasOwnProperty('phone')) {
        const domain = authData.phone.substring(authData.phone.length - 3);
        const start = authData.phone.substring(0, 2);
        this.phone = start.concat(Array(authData.phone.length - 4).join('*')).concat(domain);
      }
    } else {
      this.router.navigate([`${ROUTE_URL.auth_root}${ROUTE_URL.login_page}`]);
    }
  }
  checkOTP() {
    if (this.twoFactorAuthenticationForm.invalid) {
      this.alertSevice.showErrorAlert('Please fill in the required fields.');
      return;
    }
    this.authService
      .varifyOTP({ otp: this.twoFactorAuthenticationForm.controls.otp.value })
      .pipe(first())
      .subscribe({
        next: (user) => {
          this.router.navigate([this.returnUrl]);
        },
        error: (error) => {
          if (error.error.error.error.code == 607) {
            this.router.navigate([`${ROUTE_URL.auth_root}${ROUTE_URL.agreement_policy}`]);
          } else {
            this.alertSevice.showErrorAlert(ERROR_CODE.invalid_otp);
          }
        },
      });
  }
  resendEmail() {
    this.authService
      .resendEmail()
      .pipe(first())
      .subscribe({
        next: (data) => {
          this.alertSevice.showSuccessAlert(data.message);
        },
      });
  }
  resendMessage() {
    this.authService
      .resendEmail()
      .pipe(first())
      .subscribe({
        next: (data) => {
          this.alertSevice.showSuccessAlert(data.message);
        },
      });
  }
  isInvalid(fieldName: string): boolean {
    return OrbundValidators.isInvalid(this.twoFactorAuthenticationForm, fieldName);
  }
}
