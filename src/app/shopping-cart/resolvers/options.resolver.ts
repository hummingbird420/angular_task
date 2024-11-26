import { Injectable } from '@angular/core';
import { Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { FetchCartOptions } from '../cart-states';

@Injectable({
  providedIn: 'root',
})
export class OptionsResolver implements Resolve<boolean> {
  constructor(protected store: Store) {}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return this.store.dispatch(new FetchCartOptions());
  }
}
