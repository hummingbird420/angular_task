import { Pipe, PipeTransform } from '@angular/core';
import { DictionaryService } from '../services';

@Pipe({
  name: 'translate',
})
export class TranslatePipe implements PipeTransform {
  constructor(private dictionaryService: DictionaryService) {}

  transform(value: string): string {
    return this.dictionaryService.getTranslationOrWord(value);
  }
}
