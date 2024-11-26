import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { switchMap, take } from 'rxjs/operators';
import { ShoppingCartService } from './service/shopping-cart.service';
import { CART_URL } from './util/constant';

@Component({
  templateUrl: './cart-base.page.html',
})
export class CartBasePage {
  public multiple: boolean;
  classListPages = [
    CART_URL.course_link,
    CART_URL.search_course_link,
    CART_URL.program_link,
    CART_URL.search_program_link,
  ];
  protected words: string[] = [];
  public sessionExpired: boolean = false;
  constructor(protected route: ActivatedRoute, protected cartService: ShoppingCartService) {
    this.multiple = route.parent?.snapshot.data['multiple'];
  }

  init(callBack?: (adminId: number) => {}) {
    let isClassListPage = false;

    this.route.url
      .pipe(
        switchMap((urls) => {
          if (this.classListPages.includes(urls[0].path)) {
            this.cartService.classListPage = urls[0].path;
            isClassListPage = true;
          }

          return this.route.paramMap;
        }),
        take(1)
      )
      .pipe(
        switchMap((paramMap) => {
          const adminId = parseInt(paramMap.get('id') || '0');
          this.cartService.adminId = adminId;

          return this.route.queryParamMap;
        }),
        take(1)
      )
      .subscribe((queryParamMap) => {
        this.cartService.courseDesc = queryParamMap.get('courseDesc');
        if (callBack) {
          callBack(this.cartService.adminId);
        }
      });
  }
}
