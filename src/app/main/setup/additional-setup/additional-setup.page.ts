import { Component, OnInit } from '@angular/core';
import { createBreadcrumb, Page } from '../../page';

@Component({
  templateUrl: './additional-setup.page.html',
  styleUrls: ['./additional-setup.page.scss'],
})
export class AdditionalSetupPage extends Page implements OnInit {
  constructor() {
    super();
    this.subTitles = [createBreadcrumb('Additional Setup', undefined, true)];
  }

  ngOnInit(): void {}
}
