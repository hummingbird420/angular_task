import { Component, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { fromEvent, Observable, Subject } from 'rxjs';
import { delay, map, take, takeUntil } from 'rxjs/operators';
import { CartOptions } from './models';
import { ShoppingCartService } from './service/shopping-cart.service';
import {
  AddCartFooter,
  AddCartHeader,
  FetchCartOptions,
  ResetFromLocalStorage,
  ShoppingCartState,
} from './cart-states';
import { LSItemName } from './util/constant';

@Component({
  templateUrl: './shopping-cart.page.html',
  styleUrls: ['./shopping-cart.page.scss'],
})
export class ShoppingCartPage implements OnInit, OnDestroy {
  private dead$ = new Subject<void>();
  hasCustomHeader: boolean = false;
  hasCustomFooter: boolean = false;
  customHeader: string = '';
  customFooter: string = '';
  themeColor: string = 'cartblue';

  source$!: Observable<Event>;

  @Select(ShoppingCartState.header)
  customHeader$!: Observable<string>;

  @Select(ShoppingCartState.footer)
  customFooter$!: Observable<string>;

  @Select(ShoppingCartState.cartOptions)
  cartOptions$!: Observable<CartOptions>;

  cartCount = 0;
  @Select(ShoppingCartState.cartItemCount)
  cartItemCount$!: Observable<(multiple: boolean) => number>;

  multiple: boolean = false;

  constructor(
    private renderer: Renderer2,
    private route: ActivatedRoute,
    private store: Store,
    private cartService: ShoppingCartService
  ) {
    this.cartService.multiple = this.route.snapshot.data['multiple'];
    this.multiple = this.route.snapshot.data['multiple'];
    this.cartService.fetchTranslatedWords(['Your Cart']).subscribe();
  }
  ngOnDestroy(): void {
    this.dead$.next();
    this.dead$.complete();
  }

  ngOnInit(): void {
    this.renderer.addClass(document.body, 'shopping-cart-root');
    this.source$ = fromEvent(window, 'storage');
    this.source$.pipe(delay(500)).subscribe((data) => {
      const selectedClassIds = this.getSelectedClassIds();
      this.store.dispatch(new ResetFromLocalStorage(selectedClassIds)).pipe(take(1));
    });

    this.cartOptions$.pipe(takeUntil(this.dead$)).subscribe((options) => {
      if (options) {
        this.renderer.removeClass(document.body, this.themeColor);
        this.themeColor = 'cart' + options.color;
        this.renderer.addClass(document.body, this.themeColor);
      } else {
        this.store.dispatch(new FetchCartOptions()).pipe(take(1)).subscribe();
      }
    });

    this.customHeader$.pipe(takeUntil(this.dead$)).subscribe((customHeader) => {
      this.customHeader = customHeader;
      if (customHeader) this.hasCustomHeader = customHeader.trim().length > 0;
    });

    this.customFooter$.pipe(takeUntil(this.dead$)).subscribe((customFooter) => {
      this.customFooter = customFooter;
      if (customFooter) this.hasCustomFooter = customFooter.trim().length > 0;
    });

    this.cartItemCount$.pipe(takeUntil(this.dead$)).pipe(map((fn) => fn(this.multiple))).subscribe((itemCount) => {      
      this.cartCount = itemCount;
    });

    this.cartService.getHeaderFooter().subscribe((data) => {
      this.store.dispatch([new AddCartHeader(data.header), new AddCartFooter(data.footer)]).pipe(take(1));
    });
  }

  private getSelectedClassIds() {
    const ids = localStorage.getItem(LSItemName.SCART_SELECTED_CLASS_IDS);
    let classIds: number[] = [];
    if (ids !== undefined && ids !== null) {
      try {
        classIds = JSON.parse(ids);
      } catch (eerr) {
        //Just skip if fail to parse
      }
    }
    return classIds;
  }
}
