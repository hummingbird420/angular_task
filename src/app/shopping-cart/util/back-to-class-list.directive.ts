import { Directive, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { ShoppingCartService } from '../service/shopping-cart.service';

@Directive({
  selector: '[backToClassList]',
})
export class BackToClassListDirective {
  constructor(
    private router: Router,
    private shoppingCartService: ShoppingCartService
  ) {}

  @HostListener('click') onClick() {
    this.router.navigateByUrl(this.shoppingCartService.getClassListPage());
  }
}
