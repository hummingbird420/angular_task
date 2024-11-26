import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[oNumber]',
})
export class NumberDirective {
  private specialKeys: Array<string> = [
    'Backspace',
    'Tab',
    'End',
    'Home',
    'ArrowLeft',
    'ArrowRight',
    'Del',
    'Delete',
  ];

  private operatorKeys: Array<string> = [
    'c',
    'C',
    'v',
    'V',
    'x',
    'X',
    'z',
    'Z',
    'y',
    'Y',
  ];

  // Allow decimal numbers and negative values
  private regexDecimal: RegExp = new RegExp(/^\d*\.?\d{0,2}$/g);
  // Allow positive interger
  private regexPositive: RegExp = new RegExp(/^[0-9]\d*$/);

  @Input() oNumber = '';
  @Input() maxValue = 0;

  constructor(private elementRef: ElementRef) {}

  @HostListener('keydown', ['$event']) onKeyDown(event: KeyboardEvent) {
    const operatorKey = event.ctrlKey && this.operatorKeys.includes(event.key);

    if (operatorKey || this.specialKeys.indexOf(event.key) !== -1) {
      return;
    }

    const nativeElement = this.elementRef.nativeElement;
    let current: string = nativeElement.value;
    const position = nativeElement.selectionStart;
    const next: string = [
      current.slice(0, position),
      event.key == 'Decimal' ? '.' : event.key,
      current.slice(position),
    ].join('');

    const regex =
      this.oNumber === 'decimal' ? this.regexDecimal : this.regexPositive;
    if (next && !String(next).match(regex)) {
      event.preventDefault();
    }

    const hasSelection =
      nativeElement.selectionStart !== nativeElement.selectionEnd;
    if (this.maxValue > 0 && !hasSelection && parseInt(next) > this.maxValue) {
      event.preventDefault();
    }
  }
}
