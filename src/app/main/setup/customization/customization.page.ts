import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { SetupItemInfo } from 'src/app/models/setup-item-info';
import { ListcodeService, SetupService } from 'src/app/services';
import { createBreadcrumb, Page } from '../../page';

const recentlyViewed: SetupItemInfo[] = [];

@Component({
  templateUrl: './customization.page.html',
  styleUrls: ['./customization.page.scss'],
})
export class CustomizationPage extends Page implements OnInit, OnDestroy {
  private setupItemsSubscription?: Subscription;
  setupItems: SetupItemInfo[];
  recentlyViewedItems: SetupItemInfo[];
  setupItemsRight: SetupItemInfo[];
  search: FormControl = new FormControl('');
  recentView: boolean;

  constructor(
    private cdRef: ChangeDetectorRef,
    private setupService: SetupService,
    private listCodeService: ListcodeService
  ) {
    super();
    this.subTitles = [createBreadcrumb('Customization', undefined, true)];
    this.setupItems = [];
    this.recentlyViewedItems = recentlyViewed;
    this.setupItemsRight = [];
    this.recentView = this.recentlyViewedItems.length > 0;
  }
  ngOnDestroy(): void {
    this.setupItemsSubscription?.unsubscribe();
  }

  ngOnInit(): void {
    this.setupItemsSubscription = this.setupService
      .getSetupItems()
      .pipe(
        map((items) => {
          items.forEach((item) => {
            this.listCodeService.addListText(item.listType, item.title);
          });
          return items;
        })
      )
      .subscribe((setupItems) => {
        this.setupItems = setupItems;
        this.cdRef.detectChanges();
      });
  }

  getLinkUrl(item: SetupItemInfo) {
    let url = ['/setup/customization', item.url];
    if (item.url.includes('payment-plans')) {
      url = ['/setup', item.url];
    }
    if (item.url.includes('tuition-rate-types')) {
      url = ['/setup/tuition-and-fees', item.url];
    }
    if (item.listType > 0) {
      url.push(item.listType + '');
    }
    return url.join('/');
  }

  onViewItem(item: SetupItemInfo) {
    let lastItem;
    if (recentlyViewed.length) {
      lastItem = recentlyViewed[0];
    }
    recentlyViewed[0] = item;
    if (lastItem) recentlyViewed[1] = lastItem;
  }

  onSearch() {
    this.recentView =
      this.search.value.length <= 0 && this.recentlyViewedItems.length > 0;
  }

  encodeUrlSlash(urlText: string) {
    return urlText.replace('/', '%2F');
  }
}
