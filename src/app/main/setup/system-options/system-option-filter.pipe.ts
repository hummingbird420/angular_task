import { Pipe, PipeTransform } from '@angular/core';
import { SystemOptionsInfo } from 'src/app/models';

@Pipe({
  name: 'systemOptionFilter',
})
export class SystemOptionFilterPipe implements PipeTransform {
  transform(
    options: SystemOptionsInfo[],
    searchText: string
  ): SystemOptionsInfo[] {
    if (!options) {
      return [];
    }
    if (!searchText) {
      return options;
    }
    searchText = searchText.toLocaleLowerCase();

    return options.filter((option) => {
      return (
        option.options.filter((item) => {
          return item.title.toLocaleLowerCase().includes(searchText);
        }).length > 0
      );
    });
  }
}
