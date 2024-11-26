import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { LoginPage, ForgotPasswordPage } from '.';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';

import { AuthComponent } from './auth.component';
import { ReactiveFormsModule } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { TwoFactorAuthenticationPage } from './two-factor-authentication/two-factor-authentication.page';
import { MatDividerModule } from '@angular/material/divider';
import { AgreementPolicyPage } from './agreement-policy/agreement-policy.page';
import { ResetPasswordPage } from './reset-password/reset-password.page';
import { ForgotPasswordReplyPage } from './forgot-password/forgot-password-reply.page';

@NgModule({
  declarations: [
    AuthComponent,
    LoginPage,
    ForgotPasswordPage,
    TwoFactorAuthenticationPage,
    AgreementPolicyPage,
    ResetPasswordPage,
    ForgotPasswordReplyPage,
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatDividerModule,
  ],
  providers: [Title],
})
export class AuthModule {}
