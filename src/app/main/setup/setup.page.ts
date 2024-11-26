import { Component, OnInit } from '@angular/core';
import { RightLinkService, WidgetTitleService } from 'src/app/services';
import { BasePage, Page } from '../page';

@Component({
  templateUrl: './setup.page.html',
})
export class SetupPage extends BasePage implements OnInit {
  title: string = 'Setup & Customization';

  constructor(private rightLinkService: RightLinkService) {
    super();
  }

  ngOnInit(): void {}

  onRouteActivated(component: any) {
    this.setRightLinkUrl(component, this.rightLinkService);
    if (component instanceof Page) {
      component.title = 'Setup & Customization';
    }
  }
}
