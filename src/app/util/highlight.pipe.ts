import { TitleCasePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'highlight',
})
export class HighlightPipe implements PipeTransform {
  constructor(private titleCasePipe: TitleCasePipe) {}
  transform(value: any, args: any): any {
    if (!args) {
      return value;
    }

    const regex = new RegExp(args, 'gi');
    const match = value.match(regex);

    if (!match) {
      return value;
    }

    let i = -1;
    return value.replace(regex, () => {
      i++;
      return `<span class='highlight'>${match[i]}</span>`;
    });
  }
}
