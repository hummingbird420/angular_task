import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { switchMap, take, takeUntil } from 'rxjs/operators';
import { CartBasePage } from '../cart-base.page';
import { CartOptions, MADisplayCartStudentInfo } from '../models';
import { ShoppingCartService } from '../service/shopping-cart.service';
import { CartFilterState, FetchCartOptions, ShoppingCartState, UpdateCurrentUserType } from '../cart-states';

@Component({
  templateUrl: './registration.page.html',
  styleUrls: ['./registration.page.scss'],
})
export class RegistrationPage extends CartBasePage implements OnInit, OnDestroy {
  private dead$ = new Subject<void>();

  @Select(ShoppingCartState.maDisplayCartStudents)
  maDisplayCartStudents$!: Observable<MADisplayCartStudentInfo[]>;

  @Select(ShoppingCartState.cartOptions)
  cartOptions$!: Observable<CartOptions>;

  @Select(CartFilterState.allSelectedFilter)
  allSelectedFilter$!: Observable<any>;

  selectedLevelId: number = -1;
  selectedProgramId: number = -1;
  selectedProgramLevelId: number = -1;

  allowStudentRegistration: boolean = true;
  allowContactRegistration: boolean = true;

  constructor(
    private router: Router,
    route: ActivatedRoute,
    private shoppingCartService: ShoppingCartService,
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
    this.cartOptions$
      .pipe(takeUntil(this.dead$))
      .pipe(
        switchMap((options) => {
          if (options) {
            this.allowStudentRegistration = !options.dontAllowStudentRegistration;
            this.allowContactRegistration = !options.dontAllowGroupRegistration;
          } else {
            this.store.dispatch(new FetchCartOptions());
          }

          return this.maDisplayCartStudents$;
        })
      )
      .pipe(takeUntil(this.dead$))
      .subscribe((maDisplayCartStudents) => {
        if (this.multiple && maDisplayCartStudents.length > 1) {
          this.allowStudentRegistration = false;
          this.allowContactRegistration = true;
        }

        if (this.allowContactRegistration === false) {
          this.goToLoginPage(1);
        }
        if (this.allowStudentRegistration === false) {
          this.goToLoginPage(99);
        }
      });
  }

  goToLoginPage(userType: 0 | 1 | 99) {
    this.store
      .dispatch(new UpdateCurrentUserType(userType))
      .pipe(take(1))
      .subscribe((response) => {
        this.shoppingCartService.currentUserType = userType;
        this.shoppingCartService.goLoginPage(this.router);
      });
  }
}
