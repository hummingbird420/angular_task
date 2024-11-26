import { Pipe, PipeTransform } from '@angular/core';
import { PairValue } from 'src/app/models';

@Pipe({
  name: 'optionFilter',
})
export class OptionFilterPipe implements PipeTransform {
  transform(
    options: PairValue<string, string>[],
    searchText: string
  ): PairValue<string, string>[] {
    if (!options) {
      return [];
    }
    if (!searchText) {
      return options;
    }
    searchText = searchText.toLocaleLowerCase();
    return options.filter((option) =>
      option.title.toLocaleLowerCase().includes(searchText)
    );
  }
}
