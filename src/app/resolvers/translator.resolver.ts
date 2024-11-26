import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router';

import { Observable, of } from 'rxjs';

import { catchError } from 'rxjs/operators';
import { ShoppingCartService } from '../shopping-cart/service/shopping-cart.service';

@Injectable({
  providedIn: 'root',
})
export class TranslatorResolver implements Resolve<any> {
  constructor(private cartService: ShoppingCartService) {}
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> {
    const words = route.data['words'] || [];
    return this.cartService.fetchTranslatedWords(words).pipe(
      catchError((errors, caught) => {
        return of(errors);
      })
    );
  }
}
