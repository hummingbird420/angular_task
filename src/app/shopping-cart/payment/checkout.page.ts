import { BreakpointObserver } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { ActivatedRoute, Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Subject, Observable } from 'rxjs';
import { map, take, takeUntil } from 'rxjs/operators';
import { CartBasePage } from '../cart-base.page';
import {
  CartOptions,
  CartPaymentPlanMap,
  CartPaymentScheduleInfo,
  CartSummaryInfo,
  CollectPaymentClassInfo,
  CollectPaymentInfo,
  ColumnInfo,
  PaymentPlanInfo,
  TextBookOrOtherChargeInfo,
} from '../models';
import { ShoppingCartService } from '../service/shopping-cart.service';
import {
  RemoveAllFromCart,
  ShoppingCartState,
  UpdateClassIdAndPaymentPlanMap,
  UpdateThankYouPageResponse,
} from '../cart-states';
import { LSItemName } from '../util/constant';

@Component({
  templateUrl: './checkout.page.html',
  styleUrls: ['./checkout.page.scss'],
  host: {
    '(window:resize)': 'repaintClassTable(true)',
  },
})
export class CheckoutPage extends CartBasePage implements OnInit, OnDestroy {
  columns: ColumnInfo[] = [];
  selectedClasses: CollectPaymentClassInfo[] = [];
  cartAmountInfo: CartSummaryInfo = {} as CartSummaryInfo;
  showAdditionalInfo: boolean = false;
  isMobile: boolean = false;
  private dead$ = new Subject();
  collectPaymentInfo!: CollectPaymentInfo;

  studentIds: number[] = [];

  @Select(ShoppingCartState.cartOptions)
  cartOptions$!: Observable<CartOptions>;
  currencySign: string = '$';
  dontShowPaymentScreen: boolean = false;

  @Select(ShoppingCartState.selectedClassIds)
  selectedClassIds$!: Observable<(multiple: boolean) => number[]>;
  selectedClassIds: number[] = [];

  @Select(ShoppingCartState.registration)
  registration$!: Observable<any>;

  @Select(ShoppingCartState.classIdAndPaymentPlanMap)
  classIdAndPaymentPlanIds$!: Observable<CartPaymentPlanMap[]>;
  classIdPaymentPlanIdMap: CartPaymentPlanMap[] = [];

  paymentSchedules: Map<string, CartPaymentScheduleInfo[]> = new Map();
  todayPayment: number = 0;
  total: number = 0;
  otherCharges: number = 0;
  errorMessage: string = '';
  showPrice: boolean = true;
  classTableWidth: number = 0;
  mobileClassTable = false;

  constructor(
    route: ActivatedRoute,
    private router: Router,
    private shoppingCartService: ShoppingCartService,
    private cdRef: ChangeDetectorRef,
    private breakpointObserver: BreakpointObserver,
    private store: Store
  ) {
    super(route, shoppingCartService);
    this.init();
  }
  ngOnDestroy(): void {
    this.dead$.next();
    this.dead$.complete();
  }

  ngOnInit(): void {
    this.cartOptions$.pipe(take(1)).subscribe((options) => {
      if (options) {
        this.currencySign = options.currencySign;
        this.dontShowPaymentScreen = options.dontShowPaymentScreen;
      }
      this.shoppingCartService.getCollectPaymentInfo().subscribe(
        (data) => {
          if (this.dontShowPaymentScreen || data.todayPayment <= 0.01) {
            this.shoppingCartService.fetchThankYouInfo(this.multiple).subscribe(
              (response) => {
                this.store.dispatch(new UpdateThankYouPageResponse(response)).subscribe(() => {
                  this.shoppingCartService.goToThankyouPage(this.router);
                });
              },
              (errors) => this.handleError(errors)
            );
          } else {
            console.log(data);
            this.initPaymentInformation(data);
          }
        },
        (errors) => this.handleError(errors)
      );
    });
    this.selectedClassIds$
      .pipe(takeUntil(this.dead$))
      .pipe(map((fn) => fn(this.multiple)))
      .subscribe((data) => {
        this.selectedClassIds = data;
      });
    this.classIdAndPaymentPlanIds$.pipe(takeUntil(this.dead$)).subscribe((data) => {
      this.classIdPaymentPlanIdMap = data;
      this.cdRef.detectChanges();
    });

    this.onViewChange();
  }

  private initPaymentInformation(data: CollectPaymentInfo) {
    this.collectPaymentInfo = data;
    this.columns = this.collectPaymentInfo.datatableColumns;
    this.selectedClasses = this.collectPaymentInfo.classes;
    this.todayPayment = data.todayPayment;
    this.otherCharges = data.otherCharges;
    this.total = data.total;
    const length = this.selectedClasses.length;
    for (let i = 0; i < length; i++) {
      const clazz = this.selectedClasses[i];
      this.paymentSchedules.set(this.createKey(clazz.classId, clazz.studentId), clazz.paymentSchedule);
      const paymentPlanMap = { classId: clazz.classId, paymentPlanId: clazz.paymentPlanId, studentId: clazz.studentId };
      this.store.dispatch(new UpdateClassIdAndPaymentPlanMap(paymentPlanMap)).subscribe();
    }
    this.showPrice = this.columns.filter((col) => col.name === 'price').length > 0;
    this.cdRef.detectChanges();
    setTimeout(() => this.repaintClassTable(), 50);
  }

  private createKey(classId: number, studentId: number): string {
    return classId + '_' + studentId;
  }

  private handleError(errors: any) {
    const error = errors.error.error;
    if (error.hasOwnProperty('error')) {
      const errorCode = error.error.code;
      const errorMessage = error.error.message;
      this.errorMessage = errorMessage;
      console.log(errorCode);

      if (errorCode === 605) {
        this.store.dispatch(new RemoveAllFromCart());
        localStorage.removeItem(LSItemName.SCART_SELECTED_CLASS_IDS);
        localStorage.removeItem(LSItemName.SCART_REGISTRATION);
        localStorage.removeItem(LSItemName.SCART_CLASSID_PAYPLANID_MAP);
      }
    }
  }

  isShowPaymentPlans(classInfo: CollectPaymentClassInfo) {
    const paymentPlans: PaymentPlanInfo[] = classInfo.paymentPlans;
    const hasMorePlans = paymentPlans.length > 1;
    const scheduleCount = this.getPaymentSchedule(classInfo.classId, classInfo.studentId).length;
    const hasMoreSchedules = paymentPlans.length === 1 && scheduleCount > 1;
    return hasMorePlans || hasMoreSchedules;
  }

  ishideRadio(classInfo: CollectPaymentClassInfo) {
    const paymentPlans: PaymentPlanInfo[] = classInfo.paymentPlans;    
    const scheduleCount = this.getPaymentSchedule(classInfo.classId, classInfo.studentId).length;
    const hasMoreSchedules = paymentPlans.length === 1 && scheduleCount > 1;
    return hasMoreSchedules;
  }

  onChecked(classId: number, paymentPlanId: number, studentId: number) {
    if (this.isPaymentPlanChecked(classId, paymentPlanId, studentId)) return;
    const paymentPlanMap = { classId: classId, paymentPlanId: paymentPlanId, studentId: studentId };
    this.store.dispatch(new UpdateClassIdAndPaymentPlanMap(paymentPlanMap)).subscribe(() => {
      this.cartService.fetchPaymentScheduleByClass(classId, paymentPlanId, studentId).subscribe(
        (data) => {
          const key = this.createKey(classId, studentId);
          this.paymentSchedules.set(key, data.paymentSchedule);
          this.todayPayment = data.todayTotalPayableAmount;
          this.total = data.totalPayableAmount;
          this.otherCharges = data.otherCharges;
        },
        (errors) => this.handleError(errors)
      );
    });
  }

  onAddDeleteClassInvoiceIndividualFee(event: MatCheckboxChange, addRemoveIndividualFee: TextBookOrOtherChargeInfo) {
    const classId = addRemoveIndividualFee.classId;
    const isDelete = event.checked ? 0 : 1;
    const payLoad = {
      classId: classId,
      feeId: addRemoveIndividualFee.id,
      feeType: addRemoveIndividualFee.type,
      isDelete: isDelete,
      studentId: addRemoveIndividualFee.studentId,
    };
    this.cartService.addRemoveIndividualFee(payLoad).subscribe((response) => {
      const paymentPlanIds = this.classIdPaymentPlanIdMap.filter(
        (value) => value.classId === payLoad.classId && value.studentId === payLoad.studentId
      );
      const paymentPlanId = paymentPlanIds.length ? paymentPlanIds[0].paymentPlanId : 0;

      this.cartService
        .fetchPaymentScheduleByClass(classId, paymentPlanId, addRemoveIndividualFee.studentId || 0)
        .subscribe(
          (data) => {
            const key = this.createKey(classId, addRemoveIndividualFee.studentId || 0);
            this.paymentSchedules.set(key, data.paymentSchedule);
            this.todayPayment = data.todayTotalPayableAmount;
            this.total = data.totalPayableAmount;
            this.otherCharges = data.otherCharges;
          },
          (errors) => this.handleError(errors)
        );
    });
  }

  getPaymentSchedule(classId: number, studentId: number) {
    return this.paymentSchedules.get(this.createKey(classId, studentId)) || [];
  }

  isPaymentPlanChecked(classId: number, paymentPlanId: number, studentId: number) {
    return (
      this.classIdPaymentPlanIdMap.filter(
        (value) => value.classId === classId && value.studentId === studentId && value.paymentPlanId === paymentPlanId
      ).length > 0
    );
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

  goToBillingPage() {
    this.shoppingCartService.goToBillingPage(this.router);
  }

  private repaintClassTable(displayResize: boolean = false) {
    const mainContainer = document.querySelector('#main-container');
    const classTable = document.querySelector('.class-table');
    mainContainer!.classList.remove('mobile');
    mainContainer!.classList.add('desktop');
    this.mobileClassTable = false;
    let clientWidth = mainContainer ? mainContainer.clientWidth : 0;
    if (displayResize) {
      this.classTableWidth = classTable ? classTable.clientWidth : 0;
    } else {
      this.classTableWidth = Math.max(classTable ? classTable.clientWidth : 0, this.classTableWidth);
    }

    if (clientWidth + 3 - 300 < this.classTableWidth) {
      mainContainer!.classList.remove('desktop');
      mainContainer!.classList.add('mobile');
      this.mobileClassTable = true;
    }
  }
}
