import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'cartHtml',
  pure: true,
})
export class CartHtmlPipe implements PipeTransform {
  constructor(private sanitized: DomSanitizer) {}
  transform(html: string): SafeHtml {
    if (html === null || html === undefined) html = '';
    return this.sanitized.bypassSecurityTrustHtml(html);
  }
}
