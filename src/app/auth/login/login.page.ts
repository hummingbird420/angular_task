import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { join } from 'path';
import { first } from 'rxjs/operators';
import { ERROR_CODE } from 'src/app/constants/api-error-code';
import { LSItemKey } from 'src/app/constants/local-storages-items';
import { ROUTE_URL } from 'src/app/constants/route-url';
import { AlertService } from 'src/app/services/alert.service';
import { OrbundValidators } from 'src/app/util';
import { AuthService } from '../../services';

@Component({
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  title = 'Liquid Ui - Login Page';
  schoolName: string;
  logo: string;
  roles: { roleId: number; roleName: string }[];
  loginForm: FormGroup;
  returnUrl: string;
  loginCounter: number = 0;
  pauseDurationHours: number = 0;
  pauseDurationMinutes: number = 0;
  pauseDurationSecoend: number = 0;
  loginDisabled: boolean = false;
  microfoftLoginEnable: boolean = false;

  constructor(
    private pageTitle: Title,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private alertSevice: AlertService,
    public dialog: MatDialog
  ) {
    this.schoolName = "Bene's Career Academy";
    this.logo = './assets/images/logo_blue.png';
    this.roles = [
      { roleId: 3, roleName: 'Instructor' },
      { roleId: 1, roleName: 'Student' },
      { roleId: 99, roleName: 'Contact' },
      { roleId: 4, roleName: 'Administrator' },
      { roleId: 6, roleName: 'Staff' },
    ];

    this.loginForm = this.formBuilder.group({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
      roleId: new FormControl('', [Validators.required]),
    });

    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
  }

  ngOnInit(): void {
    this.pageTitle.setTitle(this.title);
    this.waitUntilLoginEnabled();
    this.checkMicrosoftLogin();
  }

  credentials(): { username: string; password: string; userRole: number } {
    const username = this.loginForm.controls.username.value;
    const password = this.loginForm.controls.password.value;
    const userRole = this.loginForm.controls.roleId.value;
    return { username: username, password: password, userRole: userRole };
  }

  isInvalid(fieldName: string): boolean {
    return OrbundValidators.isInvalid(this.loginForm, fieldName);
  }
  checkMicrosoftLogin() {
    this.authService
      .checkMicrosoftCredential()
      .pipe(first())
      .subscribe({
        next: (data: any) => {
          console.log(data.enableMicrosoftSSO);
          this.microfoftLoginEnable = data.enableMicrosoftSSO;
        },
        error: (error) => {},
      });
  }
  login() {
    if (this.loginForm.invalid) {
      this.alertSevice.showErrorAlert('Please fill in the required fields.');
      return;
    }
    if (this.loginDisabled) {
      this.waitUntilLoginEnabled();
      let alartMsg = '';
      if (this.pauseDurationHours > 0) {
        alartMsg =
          this.pauseDurationHours <= 1 ? this.pauseDurationHours + ' hour' : this.pauseDurationHours + ' hours';
      }
      let minuteMsg =
        this.pauseDurationMinutes <= 1 ? this.pauseDurationMinutes + ' minute' : this.pauseDurationMinutes + ' minutes';
      alartMsg += alartMsg.length == 0 ? minuteMsg : ' and ' + minuteMsg;
      if (this.pauseDurationHours <= 0 && this.pauseDurationMinutes < 10 && this.pauseDurationSecoend > 0) {
        alartMsg +=
          this.pauseDurationSecoend == 1
            ? ' and ' + this.pauseDurationSecoend + ' second'
            : ' and ' + this.pauseDurationSecoend + ' seconds';
      }
      this.alertSevice.showErrorAlert('Locked for ' + alartMsg);
      return;
    }
    this.authService
      .authenticate(this.credentials())
      .pipe(first())
      .subscribe({
        next: (user) => {
          this.resetCounter();
          this.router.navigate([this.returnUrl]);
        },
        error: (error) => {
          if (error.error.error.error.code == 607) {
            this.resetCounter();
            this.router.navigate([`${ROUTE_URL.auth_root}${ROUTE_URL.agreement_policy}`]);
          } else if (error.error.error.error.code == 608) {
            this.resetCounter();
            const studentData = error.error.error.error.message;
            this.alertSevice.showSuccessAlert('OTP successfully sent to your Email.');
            this.router.navigate([`${ROUTE_URL.auth_root}${ROUTE_URL.two_factor_authentication_page}`], {
              state: { data: studentData },
            });
          } else {
            this.loginCounter += 1;
            if (this.loginCounter % 3 === 0) {
              this.pauseDurationMinutes = 10 * Math.pow(2, this.loginCounter / 3 - 1);
              this.loginDisabled = true;
              this.alertSevice.showErrorAlert(
                ERROR_CODE.auth_error + ' Locked for ' + this.pauseDurationMinutes + ' minutes'
              );
              let currentTimeGMTZero = new Date(
                new Date().setMinutes(new Date().getMinutes() + this.pauseDurationMinutes)
              ).toUTCString();
              localStorage.setItem('S_SIGN_IN_PAUSED_END_TIME', currentTimeGMTZero.toString());
              setTimeout(() => (this.loginDisabled = false), this.pauseDurationMinutes * 60000);
            } else {
              this.alertSevice.showErrorAlert(ERROR_CODE.auth_error);
            }
          }
        },
      });
  }
  microsoftLogin() {
    this.authService
      .checkAuthentication()

      .pipe(first())
      .subscribe({
        next: (data: any) => {
          console.log(data);
          window.location.href = data.url;
        },
        error: (error) => {},
      });
  }
  waitUntilLoginEnabled() {
    const pasueTime = localStorage.getItem(LSItemKey.SIGN_IN_PAUSED_TIME);
    if (pasueTime) {
      let difDuration = new Date(pasueTime).valueOf() - new Date(new Date().toUTCString()).valueOf();
      if (difDuration > 0) {
        this.loginDisabled = true;
        this.pauseDurationHours = parseInt((difDuration / (60000 * 60)).toString());
        this.pauseDurationMinutes = parseInt(((difDuration / (60000 * 60) - this.pauseDurationHours) * 60).toString());
        this.pauseDurationSecoend = parseInt(
          (((difDuration / (60000 * 60) - this.pauseDurationHours) * 60 - this.pauseDurationMinutes) * 60).toString()
        );
        setTimeout(() => (this.loginDisabled = false), difDuration);
      }
    }
  }
  resetCounter() {
    this.loginCounter = 0;
    this.pauseDurationHours = 0;
    this.pauseDurationMinutes = 0;
    this.pauseDurationSecoend = 0;
    this.loginDisabled = false;
    localStorage.removeItem(LSItemKey.SIGN_IN_PAUSED_TIME);
  }
}
