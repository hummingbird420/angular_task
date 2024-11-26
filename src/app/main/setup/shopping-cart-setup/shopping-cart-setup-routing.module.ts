import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CartLogPage } from './cart-log/cart-log.page';
import { CartSetupPage } from './cart-setup/cart-setup.page';
import { CouponSetupPage } from './coupon-setup/coupon-setup.page';
const routes = [
  {
    path: '',
    children: [
      { path: '', redirectTo: 'cart-setup', pathMatch: 'full' },
      { path: 'cart-setup', component: CartSetupPage },
      { path: 'coupon-setup', component: CouponSetupPage },
      { path: 'cart-log', component: CartLogPage },
    ],
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShoppingCartSetupRoutingModule {}
