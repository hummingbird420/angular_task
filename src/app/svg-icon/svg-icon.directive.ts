import { AfterViewInit, Directive, ElementRef, HostListener, OnChanges, SimpleChanges } from '@angular/core';

@Directive({
  selector: '[svgIcon]',
})
export class SvgIconDirective implements AfterViewInit, OnChanges {
  constructor(private elementRef: ElementRef) {}
  ngOnChanges(changes: SimpleChanges): void {
    setTimeout(() => {
      this.setColor();
    }, 50);
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.setColor();
    }, 50);
  }

  setColor() {
    const color = window.getComputedStyle(this.elementRef.nativeElement).getPropertyValue('color');

    const paths: SVGPathElement[] = this.elementRef.nativeElement.getElementsByTagName('path');
    const pathLength = paths.length;
    for (let index = 0; index < pathLength; index++) {
      const element: SVGPathElement = paths[index];
      element.style.stroke = color;
    }
    const circles: SVGCircleElement[] = this.elementRef.nativeElement.getElementsByTagName('circle');
    const circleLength = circles.length;
    for (let index = 0; index < circleLength; index++) {
      const element: SVGCircleElement = circles[index];
      element.style.stroke = color;
    }
  }

  @HostListener('mouseenter')
  onMouseEnter() {
    this.setColor();
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    this.setColor();
  }
}
