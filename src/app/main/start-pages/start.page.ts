import { Component, OnInit } from '@angular/core';

import { RightLinkService, WidgetTitleService } from 'src/app/services';
import { BasePage } from '../page';

@Component({
  templateUrl: './start.page.html',
})
export class StartPage extends BasePage implements OnInit {
  title: string = 'Welcome';

  constructor(
    private widgetTitleService: WidgetTitleService,
    private rightLinkService: RightLinkService
  ) {
    super();
  }

  ngOnInit(): void {}
  onRouteActivated(component: any) {
    this.setRightLinkUrl(component, this.rightLinkService);
  }
}
