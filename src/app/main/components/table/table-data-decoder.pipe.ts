import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform, SecurityContext } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'tableDataDecoder',
})
export class TableDataDecoderPipe implements PipeTransform {
  constructor(private domSanitizer: DomSanitizer, private datePipe: DatePipe) {}

  transform(value: any, type?: string, format?: string): any {
    if (type === 'HTML') {
      return this.domSanitizer.sanitize(SecurityContext.HTML, value);
    }
    if (type === 'DATE') {
      return this.datePipe.transform(value, format);
    }
    return value;
  }
}
