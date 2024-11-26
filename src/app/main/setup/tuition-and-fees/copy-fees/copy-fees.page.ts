import { Component, OnInit } from '@angular/core';
import { createBreadcrumb, Page } from 'src/app/main/page';

@Component({
  templateUrl: './copy-fees.page.html',
  styleUrls: ['./copy-fees.page.scss'],
})
export class CopyFeesPage extends Page implements OnInit {
  constructor() {
    super();
    this.subTitles = [createBreadcrumb('Copy Fees', undefined, true)];
  }

  ngOnInit(): void {}
}
