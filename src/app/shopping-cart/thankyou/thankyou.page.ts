import { BreakpointObserver } from '@angular/cdk/layout';
import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { CartBasePage } from '../cart-base.page';
import {
  CartOptions,
  CourseDescriptionInfo,
  ThankYouMessageInfo,
  ThankYouPageClientInfo,
  ThankYouPageInfo,
  ThankYouPageOrderReceiptInfo,
  ThankYouPagePaymentDetailsInfo,
  ThankyouPageResponseInfo,
  ThankYouPageSummaryInfo,
} from '../models';
import { ShoppingCartService } from '../service/shopping-cart.service';
import { RemoveAllFromCart, ShoppingCartState } from '../cart-states';
import { LSItemName } from '../util/constant';

@Component({
  templateUrl: './thankyou.page.html',
  styleUrls: ['./thankyou.page.scss'],
})
export class ThankyouPage extends CartBasePage implements OnInit, OnDestroy {
  private dead$ = new Subject<void>();

  @Select(ShoppingCartState.cartOptions)
  cartOptions$!: Observable<CartOptions>;
  websiteLink: string = '';

  @Select(ShoppingCartState.thankYouPageResponse)
  thankYouPageResponse$!: Observable<ThankyouPageResponseInfo>;
  thankyouPageResponseInfo!: ThankyouPageResponseInfo;
  thankYouMessageInfo!: ThankYouMessageInfo;
  thankYouPageClientInfo!: ThankYouPageClientInfo;
  thankYouPageOrderReceiptInfo!: ThankYouPageOrderReceiptInfo;
  thankYouPageInfo!: ThankYouPageInfo;
  cartSummary!: ThankYouPageSummaryInfo;
  thankYouPagePaymentDetailsInfo!: ThankYouPagePaymentDetailsInfo;
  courseDescriptions!: CourseDescriptionInfo[];
  waitingMessage!: string;
  courseDescriptionWaitings!: CourseDescriptionInfo[];
  isMobile: boolean = false;
  currencySign: string = '$';

  constructor(
    private store: Store,
    private cdRef: ChangeDetectorRef,
    route: ActivatedRoute,
    private breakpointObserver: BreakpointObserver,
    private shoppingCartService: ShoppingCartService
  ) {
    super(route, shoppingCartService);
    this.init();
  }

  ngOnDestroy(): void {
    setTimeout(() => {
      this.clearCache();
      this.clearLocalStorage();
      this.cdRef.detectChanges();
    }, 100);
  }

  ngOnInit(): void {
    this.thankYouPageResponse$.pipe(take(1)).subscribe((data) => {
      this.thankyouPageResponseInfo = data;
      this.thankYouMessageInfo = data.thankYouMessageInfo;
      this.thankYouPageClientInfo = data.thankYouPageClientInfo;
      this.thankYouPageOrderReceiptInfo = data.thankYouPageOrderReceiptInfo;
      this.thankYouPagePaymentDetailsInfo = data.thankYouPagePaymentDetailsInfo;
      this.courseDescriptions = data.courseDescriptions;
      this.courseDescriptionWaitings = data.courseDescriptionWaitings;
      this.waitingMessage = data.waitingMessage;
      this.thankYouPageInfo = data.thankYouPageInfo;
      if (this.thankYouPageInfo) {
        this.cartSummary = this.thankYouPageInfo.thankYouPageSummaryInfo;
      }

      if (this.thankYouMessageInfo) {
        this.redirectIfThankYouUrlFound(this.thankYouMessageInfo.body);
      }
    });
    this.cartOptions$.pipe(takeUntil(this.dead$)).subscribe((options) => {
      if (!options) return;
      this.websiteLink = options.websiteLink;
      this.currencySign = options.currencySign;
    });
  }

  private redirectIfThankYouUrlFound(thankYouMessage: string) {
    const regex: RegExp = new RegExp(/^((https?|ftp):\/\/|(www|ftp)\.)?[a-z0-9-]+(\.[a-z0-9-]+)+([/?].*)?$/gi);
    if (thankYouMessage && thankYouMessage.trim().match(regex) !== null) {
      location.href = thankYouMessage;
    }
  }

  onViewChange() {
    this.breakpointObserver
      .observe(['(max-width: 799px)'])
      .pipe(takeUntil(this.dead$))
      .subscribe((result) => {
        this.isMobile = result.matches;
        this.cdRef.detectChanges();
      });
  }

  hasThanksMessageTitle() {
    return this.thankYouMessageInfo && this.thankYouMessageInfo.title ? true : false;
  }

  thanksMessageTitle() {
    return this.hasThanksMessageTitle() ? this.thankYouMessageInfo.title : '';
  }

  printMessage() {
    return this.thankYouMessageInfo ? this.thankYouMessageInfo.header : '';
  }
  thanksMessage() {
    return this.thankYouMessageInfo ? this.thankYouMessageInfo.body : '';
  }
  hasThanksFooterMessage() {
    return this.thankYouMessageInfo && this.thankYouMessageInfo.customMessage ? true : false;
  }
  thanksFooterMessage() {
    return this.thankYouMessageInfo ? this.thankYouMessageInfo.customMessage : '';
  }

  getClientName() {
    if (this.thankYouPageClientInfo) {
      let firstName = this.thankYouPageClientInfo.firstName;
      firstName = firstName ? firstName.trim() : '';
      let middleName = this.thankYouPageClientInfo.middleName;
      middleName = middleName ? middleName.trim() : '';
      let lastName = this.thankYouPageClientInfo.lastName;
      lastName = lastName ? lastName.trim() : '';
      return `${firstName} ${middleName} ${lastName}`.trim();
    }
    return '';
  }

  getOrganization() {
    if (this.thankYouPageClientInfo) {
      let organization = this.thankYouPageClientInfo.organization;
      organization = organization ? organization.trim() : '';
      return organization;
    }
    return '';
  }

  getClientAddress() {
    if (this.thankYouPageClientInfo) {
      let address = this.thankYouPageClientInfo.address;
      address = address ? address.trim() : '';
      let city = this.thankYouPageClientInfo.city;
      city = city ? city.trim() : '';
      let state = this.thankYouPageClientInfo.state;
      state = state ? state.trim() : '';
      let zipCode = this.thankYouPageClientInfo.zipCode;
      zipCode = zipCode ? zipCode.trim() : '';
      return `${address} ${city} ${state} ${zipCode}`.trim();
    }
    return '';
  }

  getCountry() {
    if (this.thankYouPageClientInfo) {
      let country = this.thankYouPageClientInfo.country;
      country = country ? country.trim() : '';
      return country;
    }
    return '';
  }

  private clearCache() {
    this.store.dispatch([new RemoveAllFromCart()]);
  }

  private clearLocalStorage() {
    localStorage.removeItem(LSItemName.SELECTED_CAMPUS);
    localStorage.removeItem(LSItemName.SELECTED_DEPARTMENT);
    localStorage.removeItem(LSItemName.SELECTED_CATEGORY);
    localStorage.removeItem(LSItemName.SELECTED_PROGRAM);
    localStorage.removeItem(LSItemName.SELECTED_PROGRAM_LEVEL);
    localStorage.removeItem(LSItemName.SELECTED_LOCATION);
    localStorage.removeItem(LSItemName.SELECTED_SEMESTER);
    localStorage.removeItem(LSItemName.SELECTED_START_DATE);
    localStorage.removeItem(LSItemName.SELECTED_END_DATE);

    localStorage.removeItem(LSItemName.SCART_SELECTED_CLASS_IDS);
    localStorage.removeItem(LSItemName.SCART_REGISTRATION);
    localStorage.removeItem(LSItemName.SCART_CLASSID_PAYPLANID_MAP);
  }
}
