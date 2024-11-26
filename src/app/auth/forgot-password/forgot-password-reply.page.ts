import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ROUTE_URL } from 'src/app/constants/route-url';

@Component({
  selector: 'o-forgot-password-reply',
  templateUrl: './forgot-password-reply.page.html',
  styleUrls: ['./forgot-password-reply.page.scss'],
})
export class ForgotPasswordReplyPage implements OnInit {
  routeState: any;
  message: string = '';
  constructor(private router: Router) {
    this.routeState = this.router?.getCurrentNavigation()?.extras.state;
  }

  ngOnInit(): void {
    if (this.routeState) {
      this.message = this.routeState.data;
    } else {
      this.router.navigate([`${ROUTE_URL.auth_root}${ROUTE_URL.forgot_password}`]);
    }
  }
}
