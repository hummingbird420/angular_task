import {
  Directive,
  ElementRef,
  HostListener,
  Input,
  Renderer2,
} from '@angular/core';

@Directive({
  selector: '[oHoverItemContent]',
})
export class HoverItemContentDirective {
  @Input() oHoverItemContent: string = '';
  constructor(private elementRef: ElementRef, private renderer: Renderer2) {}
  @HostListener('mouseenter') onHover() {
    let headerRow = this.getHeaderRow();
    if (headerRow) {
      this.renderer.addClass(headerRow, 'hover');
    }
  }
  @HostListener('mouseleave') onHoverExit() {
    let headerRow = this.getHeaderRow();
    if (headerRow) {
      this.renderer.removeClass(headerRow, 'hover');
    }
  }

  getHeaderRow() {
    const parent = this.renderer.parentNode(this.elementRef.nativeElement);
    return parent.querySelector('#header-row' + this.oHoverItemContent);
  }
}
