import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[cartPrint]',
})
export class CartPrintDirective {
  constructor() {}
  @HostListener('click') onClick() {
    window.print();
  }
}
