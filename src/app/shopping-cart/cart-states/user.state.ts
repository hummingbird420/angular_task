import { Injectable } from '@angular/core';
import { Selector, State } from '@ngxs/store';

export interface CartUserStateModel {
  isAuthorized: boolean;
  sessionId: string;
}

@State<CartUserStateModel>({
  name: 'shoppingcartuser',
  defaults: {
    isAuthorized: false,
    sessionId: '',
  },
})
@Injectable()
export class CartUserState {
  @Selector()
  static isAuthorized(userState: CartUserStateModel) {
    return userState.isAuthorized;
  }
}
