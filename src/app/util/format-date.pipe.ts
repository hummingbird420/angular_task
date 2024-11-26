import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatDate',
})
export class FormatDatePipe extends DatePipe implements PipeTransform {
  transform(value: any, format?: any): any {
    return super.transform(value, format);
  }
}
