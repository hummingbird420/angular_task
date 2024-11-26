import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthComponent, LoginPage, ForgotPasswordPage } from '.';
import { ROUTE_URL } from '../constants/route-url';
import { SessionResolver } from '../resolvers/session.resolver';
import { AgreementPolicyPage } from './agreement-policy/agreement-policy.page';
import { ForgotPasswordReplyPage } from './forgot-password/forgot-password-reply.page';
import { ResetPasswordPage } from './reset-password/reset-password.page';
import { TwoFactorAuthenticationPage } from './two-factor-authentication/two-factor-authentication.page';

const routes: Routes = [
  {
    path: '',
    component: AuthComponent,
    resolve: {
      sessionId: SessionResolver,
    },
    children: [
      { path: '', redirectTo: `/${ROUTE_URL.login_page}`, pathMatch: 'full' },
      { path: ROUTE_URL.login_page, component: LoginPage },
      { path: ROUTE_URL.two_factor_authentication_page, component: TwoFactorAuthenticationPage },
      { path: ROUTE_URL.agreement_policy, component: AgreementPolicyPage },
      { path: ROUTE_URL.forgot_password, component: ForgotPasswordPage },
      { path: ROUTE_URL.forgot_password_reply, component: ForgotPasswordReplyPage },
      { path: ROUTE_URL.reset_password, component: ResetPasswordPage },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
