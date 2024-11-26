import {
  Directive,
  ElementRef,
  HostListener,
  SecurityContext,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Directive({
  selector: '[sanitizer]',
})
export class HtmlSanitizerDirective {
  constructor(
    private elementRef: ElementRef,
    private domSanitizer: DomSanitizer
  ) {}
  @HostListener('change', ['$event']) onChange() {
    const value = this.elementRef.nativeElement.value;
    console.log(value);
    this.elementRef.nativeElement.value = this.domSanitizer.sanitize(
      SecurityContext.HTML,
      value
    );
  }
}
