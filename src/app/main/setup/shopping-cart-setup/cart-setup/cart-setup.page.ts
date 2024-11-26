import { Component, OnInit } from '@angular/core';
import { createBreadcrumb, Page } from 'src/app/main/page';
import { SettingService } from 'src/app/services/setting.service';

@Component({
  templateUrl: './cart-setup.page.html',
  styleUrls: ['./cart-setup.page.scss'],
})
export class CartSetupPage extends Page implements OnInit {
  constructor(private settingService: SettingService) {
    super();
    this.subTitles = [createBreadcrumb('Shopping Cart Setup', undefined, true)];
  }

  ngOnInit(): void {
    console.log(this.settingService.getServerPath());
  }

  getHost() {
    return this.settingService.getServerPath();
  }

  getLink(
    urlType: 'course' | 'search-course' | 'program' | 'search-program',
    isMultiple?: boolean
  ) {
    const multiple = isMultiple ? '/multiple' : '';
    const baseUrl = `/shopping-cart${multiple}`;
    const adminId = this.settingService.getAdminId();
    switch (urlType) {
      case 'search-course':
        return `${baseUrl}/search-course-list-with-available-classes/${adminId}`;
      case 'program':
        return `${baseUrl}/program-list-with-courses/${adminId}`;
      case 'search-program':
        return `${baseUrl}/search-program-list-with-courses/${adminId}`;
      case 'course':
      default:
        return `${baseUrl}/course-list-with-available-classes/${adminId}`;
    }
  }
}
