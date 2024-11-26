import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HtmlDecoderPipe } from './index';
import { FormatDatePipe } from './format-date.pipe';
import { InnerAngularHtmlDirective } from './inner-angular-html.directive';
import { HighlightPipe } from './highlight.pipe';
import { TranslatePipe } from './translate.pipe';
import { AsyncTranslatePipe } from './async-translate.pipe';

@NgModule({
  declarations: [
    HtmlDecoderPipe,
    FormatDatePipe,
    InnerAngularHtmlDirective,
    HighlightPipe,
    TranslatePipe,
    AsyncTranslatePipe,
  ],
  imports: [CommonModule],
  exports: [
    HtmlDecoderPipe,
    FormatDatePipe,
    HighlightPipe,
    TranslatePipe,
    AsyncTranslatePipe,
  ],
})
export class UtilModule {}
