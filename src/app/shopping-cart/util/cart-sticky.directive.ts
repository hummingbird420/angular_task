import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[cartTopSticky]',
})
export class CartStickyDirective {
  @Input() cartTopSticky = 0;

  docBody: HTMLElement = document.documentElement || document.body.parentNode || document.body;

  constructor(private el: ElementRef) {}

  @HostListener('window:scroll', [])
  onScroll(): void {
    const classList: DOMTokenList = this.el.nativeElement.classList;
    let height = 20;
    let top = 0;
    const scrollTop = window.pageYOffset !== undefined ? window.pageYOffset : this.docBody.scrollTop;

    const headerElement = document.querySelectorAll('.custom-header');
    if (headerElement.length > 0) {
      height = 6;
      headerElement.forEach((element) => {
        height += element.clientHeight;
      });
    }
    const stickyElements = document.querySelectorAll('.sticky');
    if (stickyElements.length > 0) {
      for (let i = 0; i < stickyElements.length; i++) {
        if (i > 0) {
          top = stickyElements[i - 1].clientHeight;
        }
      }
    }
    let cartHeader;
    if (classList.contains('top-cart')) {
      top = 0;
    } else {
      cartHeader = document.querySelector('.cart-header-wrapper');
    }
    if (scrollTop <= height) {
      this.el.nativeElement.classList.remove('bg-white');
      this.el.nativeElement.classList.remove('sticky');
      if (cartHeader) {
        cartHeader.classList.remove('.no-box-shadow');
      }
    } else {
      this.el.nativeElement.style.top = top + 'px';
      this.el.nativeElement.classList.add('sticky');
      this.el.nativeElement.classList.add('bg-white');
      if (cartHeader) {
        cartHeader.classList.add('.no-box-shadow');
      }
    }
  }
}
