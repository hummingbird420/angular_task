import { Pipe, PipeTransform } from '@angular/core';
import { Observable } from 'rxjs';
import { DictionaryService } from '../services';

@Pipe({
  name: 'asyncTranslate',
})
export class AsyncTranslatePipe implements PipeTransform {
  constructor(private dictionaryService: DictionaryService) {}

  transform(value: string): Observable<string> {
    return this.dictionaryService.getTranslatedWord(value);
  }
}
