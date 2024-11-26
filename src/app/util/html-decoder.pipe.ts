import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'htmlDecoder',
})
export class HtmlDecoderPipe implements PipeTransform {
  transform(value: string): string {
    const tempElement = document.createElement('div');
    tempElement.innerHTML = value;
    return tempElement.innerText;
  }
}
