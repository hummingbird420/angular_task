import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { ROUTE_URL } from 'src/app/constants/route-url';
import { AlertService, AuthService } from 'src/app/services';
import { OrbundValidators } from 'src/app/util';

@Component({
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage implements OnInit {
  schoolName: string;
  logo: string;
  roles: { roleId: number; roleName: string }[];
  forgotPasswordForm: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private alertSevice: AlertService,
    private router: Router
  ) {
    this.schoolName = 'Orbund Demo Institute';
    this.logo = './assets/images/logo_blue.png';
    this.roles = [
      { roleId: 3, roleName: 'Instructor' },
      { roleId: 1, roleName: 'Student' },
      { roleId: 99, roleName: 'Contact' },
      { roleId: 6, roleName: 'Staff' },
    ];

    this.forgotPasswordForm = this.formBuilder.group({
      username: new FormControl(''),
      email: new FormControl('', [Validators.required, Validators.email]),
      roleId: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit(): void {}
  credentials(): { username: string; email: string; userRole: number } {
    const username = this.forgotPasswordForm.controls.username.value;
    const email = this.forgotPasswordForm.controls.email.value;
    const userRole = this.forgotPasswordForm.controls.roleId.value;
    return { username: username, email: email, userRole: userRole };
  }
  forgotPassword() {
    if (this.forgotPasswordForm.invalid) {
      this.alertSevice.showErrorAlert('Please fill in the required fields.');
      return;
    }

    this.authService
      .forgotPassword(this.credentials())
      .pipe(first())
      .subscribe({
        next: (user) => {
          if (
            user.response ==
            "<p><font size='2' face='Arial'>No record found with this username/email address.</font></p>"
          ) {
            this.alertSevice.showWarnAlert(user.response);
          } else {
            this.router.navigate([`${ROUTE_URL.auth_root}${ROUTE_URL.forgot_password_reply}`], {
              state: { data: user.response },
            });
          }
        },
        error: (error) => {
          this.alertSevice.showErrorAlert('Authentication failed.');
        },
      });
  }
  isInvalid(fieldName: string): boolean {
    return OrbundValidators.isInvalid(this.forgotPasswordForm, fieldName);
  }
}
