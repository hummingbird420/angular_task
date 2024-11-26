import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import * as DomPurify from 'dompurify';

@Pipe({
  name: 'safeHtml',
})
export class SafeHtmlPipe implements PipeTransform {
  constructor(private sanitized: DomSanitizer) {}
  transform(value: any) {
    const sanitizedContent = DomPurify.sanitize(value, { FORCE_BODY: true });
    return this.sanitized.bypassSecurityTrustHtml(sanitizedContent);
  }
}
