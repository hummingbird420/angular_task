import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable, of, Subject } from 'rxjs';
import { map, take, takeUntil } from 'rxjs/operators';
import { FileService } from 'src/app/services';
import { CartOptions } from '../models';
import { ShoppingCartService } from '../service/shopping-cart.service';
import { ShoppingCartState } from '../cart-states';
import { CartBasePage } from '../cart-base.page';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'cart-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  private dead$ = new Subject<void>();
  @Input() adminId: number = 0;
  logo?: Observable<string>;
  defaultLogo: string = 'assets/images/logo_blue.png';
  cartCount = 0;

  @Select(ShoppingCartState.cartItemCount)
  cartItemCount$!: Observable<(multiple: boolean) => number>;

  @Select(ShoppingCartState.cartOptions)
  cartOptions$!: Observable<CartOptions>;

  schoolName: string = '';
  schoolAddress: string = '';
  displayNameAndLogo: boolean = true;
  displaySchoolName: boolean = true;
  multiple: boolean;
  constructor(route: ActivatedRoute, private fileServie: FileService, private store: Store) {
    this.multiple = route.parent?.snapshot.data['multiple'];
  }
  ngOnDestroy(): void {
    this.dead$.next();
    this.dead$.complete();
  }

  ngOnInit(): void {
    this.cartItemCount$
      .pipe(takeUntil(this.dead$))
      .pipe(map((fn) => fn(this.multiple)))
      .subscribe((cartItemCount) => {
        if (cartItemCount !== undefined) this.cartCount = cartItemCount;
      });
    this.cartOptions$.pipe(takeUntil(this.dead$)).subscribe((options) => {
      if (options) {
        this.logo = of(options.logoUrl);
        this.schoolName = options.schoolName;
        this.schoolAddress = options.schoolAddress;
        this.displayNameAndLogo = options.displayNameAndLogo;
        this.displaySchoolName = options.displaySchoolName;
      }
    });
  }
  onLogoError() {
    this.logo = of(this.defaultLogo);
  }
}
