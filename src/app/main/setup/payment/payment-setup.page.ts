import { Component, OnInit } from '@angular/core';
import { createBreadcrumb, Page } from '../../page';

@Component({
  templateUrl: './payment-setup.page.html',
  styleUrls: ['./payment-setup.page.scss'],
})
export class PaymentSetupPage extends Page implements OnInit {
  constructor() {
    super();
    this.subTitles = [createBreadcrumb('Payment Setup', undefined, true)];
  }

  ngOnInit(): void {}
}
