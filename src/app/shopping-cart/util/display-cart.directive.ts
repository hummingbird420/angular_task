import { Directive, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { ShoppingCartService } from '../service/shopping-cart.service';

@Directive({
  selector: '[oDisplayCart],[goToDisplayCart]',
})
export class DisplayCartDirective {
  constructor(
    private router: Router,
    private shoppingCartService: ShoppingCartService
  ) {}

  @HostListener('click') onClick() {
    const multiple = this.shoppingCartService.multiple ? '/multiple' : '';
    const url = `/shopping-cart${multiple}/display-cart/${this.shoppingCartService.adminId}`;
    this.router.navigateByUrl(url);
  }
}
