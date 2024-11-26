import { BreakpointObserver } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { map, take, takeUntil } from 'rxjs/operators';
import { CartBasePage } from '../cart-base.page';
import { CartOptions, CartSummaryInfo, ClassInfo, ColumnInfo, MADisplayCartStudentInfo } from '../models';
import { ShoppingCartService } from '../service/shopping-cart.service';
import {
  CartFilterState,
  CartFilterStateModel,
  LoadSelectedClasses,
  LoadSelectedClassesMultiple,
  ShoppingCartState,
  UpdateUserCouponCode,
} from '../cart-states';

@Component({
  templateUrl: './display-cart.page.html',
  styleUrls: ['./display-cart.page.scss'],
  host: {
    '(window:resize)': 'repaintClassTable(true)',
  },
})
export class DisplayCartPage extends CartBasePage implements OnInit, OnDestroy {
  private destroyed$ = new Subject();

  @Select(ShoppingCartState.displayCartColumns)
  columns$!: Observable<ColumnInfo[]>;

  @Select(ShoppingCartState.cartOptions)
  cartOptions$!: Observable<CartOptions>;

  @Select(ShoppingCartState.cartItemCount)
  cartItemCount$!: Observable<(multiple: boolean) => number>;

  @Select(ShoppingCartState.cartItemCountSingle)
  cartItemCountSingle$!: Observable<number>;

  @Select(ShoppingCartState.selectedClasses)
  selectedClasses$!: Observable<ClassInfo[]>;

  @Select(ShoppingCartState.cartSummary)
  cartSummary$!: Observable<CartSummaryInfo>;

  @Select(ShoppingCartState.isInvalidCoupon)
  isInvalidCoupon$!: Observable<boolean>;

  @Select(ShoppingCartState.userCouponCode)
  userCouponCode$!: Observable<string | null>;
  userCouponCode: string | null = null;

  @Select(ShoppingCartState.isAuthorized)
  isAuthorized$!: Observable<boolean>;
  isAuthorized: boolean = false;

  @Select(ShoppingCartState.currentUserType)
  currentUserType$!: Observable<0 | 1 | 99>;
  currentUserType: 0 | 1 | 99 = 0;

  @Select(ShoppingCartState.mobileView)
  mobileView$!: Observable<boolean>;

  @Select(CartFilterState.allSelectedFilter)
  allSelectedFilter$!: Observable<any>;

  selectedLevelId: number = -1;
  selectedProgramId: number = -1;
  selectedProgramLevelId: number = -1;

  @Select(ShoppingCartState.selectedClassIds)
  selectedClassIds$!: Observable<(multiple: boolean) => number[]>;
  selectedClassIds: number[] = [];

  @Select(ShoppingCartState.maDisplayCartStudents)
  maDisplayCartStudents$!: Observable<MADisplayCartStudentInfo[]>;

  isMobile: boolean = false;
  columnCount: number = 0;
  classCount: number = 0;

  couponCode = new FormControl('');
  hideCoupon: boolean = false;
  currencySign: string = '$';
  classTableWidth: number = 0;
  errorMessage: string = '';
  websiteLink: string = '';

  constructor(
    private router: Router,
    private cdRef: ChangeDetectorRef,
    private breakpointObserver: BreakpointObserver,
    private shoppingCartService: ShoppingCartService,
    private store: Store,
    route: ActivatedRoute
  ) {
    super(route, shoppingCartService);
    this.init();
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  ngOnInit(): void {
    this.takeUntil(this.isAuthorized$).subscribe((isAuthorized) => (this.isAuthorized = isAuthorized));
    this.takeUntil(this.columns$).subscribe((columns) => {
      if (columns) {
        this.columnCount = columns.length;
        this.cdRef.detectChanges();
      }
    });

    this.takeUntil(this.userCouponCode$).subscribe((userCouponCode) => {
      this.userCouponCode = userCouponCode;
      if (this.userCouponCode) {
        this.couponCode.setValue(userCouponCode, { onlySelf: true });
        this.hideCoupon = true;
        this.cdRef.detectChanges();
      }
    });

    this.takeUntil(this.cartItemCount$)
      .pipe(map((fn) => fn(this.multiple)))
      .subscribe((classCount) => {
        this.classCount = classCount;
      });
    this.takeUntil(this.cartItemCountSingle$).subscribe((single) => {
      if (single > 0) this.loadSelectedClasses();
    });
    this.takeUntil(this.maDisplayCartStudents$).subscribe((students) => {
      if (students.length) this.loadSelectedClasses();
    });

    this.takeUntil(this.cartOptions$).subscribe((options) => {
      if (options) {
        this.websiteLink = options.websiteLink;

        this.currencySign = options.currencySign;
        if (!this.userCouponCode) {
          this.hideCoupon = options.hideCoupon;
        }
      }
    });

    this.takeUntil(this.currentUserType$).subscribe((userType) => (this.currentUserType = userType));
    this.onViewChange();
    this.takeUntil(this.mobileView$).subscribe((mobileView) => (this.isMobile = mobileView));

    this.takeUntil(this.selectedClassIds$)
      .pipe(map((fn) => fn(this.multiple)))
      .subscribe((selectedClassIds) => {
        this.selectedClassIds = selectedClassIds;
      });

    this.takeUntil(this.allSelectedFilter$).subscribe((filters: CartFilterStateModel) => {
      if (filters.selectedDepartment) {
        this.selectedLevelId = filters.selectedDepartment;
      }
      if (filters.selectedProgram) {
        this.selectedProgramId = filters.selectedProgram;
      }
      if (filters.selectedProgramLevel) {
        this.selectedProgramLevelId = filters.selectedProgramLevel;
      }
    });
  }

  private takeUntil<T>(ob: Observable<T>): Observable<T> {
    return ob.pipe(takeUntil(this.destroyed$));
  }

  private loadSelectedClasses() {
    this.errorMessage = '';
    const action = this.multiple
      ? new LoadSelectedClassesMultiple(this.couponCode.value)
      : new LoadSelectedClasses(this.couponCode.value);
    this.store
      .dispatch(action)
      .pipe(take(1))
      .subscribe(
        () => {
          this.cdRef.detectChanges();
          setTimeout(() => this.repaintClassTable(), 50);
        },
        (errors) => this.handleError(errors)
      );
  }

  handleError(errors: any) {
    const error = errors.error.error;
    if (error.hasOwnProperty('error')) {
      const errorCode = error.error.code;
      const errorMessage = error.error.message;
      const errorField = error.error.fieldName;
      const isInvalidCoupon = errorCode === 103 && errorField && errorField === 'couponCode';
      if (!isInvalidCoupon) this.errorMessage = errorMessage;
    }
  }
  repaintClassTable(displayResize: boolean = false) {
    const mainContainer = document.querySelector('#main-container');
    const classTable = document.querySelector('.class-table');
    mainContainer!.classList.remove('mobile');
    mainContainer!.classList.add('desktop');
    let clientWidth = mainContainer ? mainContainer.clientWidth : 0;
    if (displayResize) {
      this.classTableWidth = classTable ? classTable.clientWidth : 0;
    } else {
      this.classTableWidth = Math.max(classTable ? classTable.clientWidth : 0, this.classTableWidth);
    }

    if (clientWidth + 3 < this.classTableWidth) {
      mainContainer!.classList.remove('desktop');
      mainContainer!.classList.add('mobile');
    }
  }
  onViewChange() {
    this.takeUntil(this.breakpointObserver.observe(['(max-width: 799px)'])).subscribe((result) => {
      this.isMobile = result.matches;
      this.cdRef.detectChanges();
    });
  }

  getValue(classInfo: any, propertyName: string) {
    return classInfo.hasOwnProperty(propertyName) ? classInfo[propertyName] : '';
  }

  applyCouponCode() {
    this.shoppingCartService.couponCode = this.couponCode.value;
    this.loadSelectedClasses();
  }

  removeCouponCode() {
    this.shoppingCartService.couponCode = '';
    this.couponCode.setValue('', { onlySelf: true });
    if (this.userCouponCode) {
      this.hideCoupon = false;
    }
    this.loadSelectedClasses();
    this.store.dispatch(new UpdateUserCouponCode(null));
  }

  continue() {
    if (this.isAuthorized) {
      if (this.currentUserType === 1) {
        const payload = {
          classIds: this.selectedClassIds,
          updateEnrollmentOnly: true,
        };
        this.cartService.updatableStudentInfo(payload).subscribe((response) => {
          this.shoppingCartService.goToCheckoutPage(this.router);
        });
      } else if (this.multiple === true) {
        const payload = {
          levelId: this.selectedLevelId,
          programId: this.selectedProgramId,
          programLevelId: this.selectedProgramLevelId,
        };
        this.shoppingCartService.saveGroupEnrollment(payload).subscribe((response) => {
          this.shoppingCartService.goToCheckoutPage(this.router);
        });
      } else {
        this.shoppingCartService.goToGroupRegisterPage(this.router);
      }
    } else {
      this.shoppingCartService.goRegistrationPage(this.router);
    }
  }
}
