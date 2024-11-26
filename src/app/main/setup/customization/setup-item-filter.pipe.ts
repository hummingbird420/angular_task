import { Pipe, PipeTransform } from '@angular/core';
import { SetupItemInfo } from 'src/app/models/setup-item-info';

@Pipe({
  name: 'setupItemFilter'
})
export class SetupItemFilterPipe implements PipeTransform {

  transform(items: SetupItemInfo[], searchText: string): SetupItemInfo[] {
    if (!items) {
      return [];
    }
    if (!searchText) {
      return items;
    }
    searchText = searchText.toLocaleLowerCase();
    return items.filter(it => {
      return (it.title + ' ' + it.description).toLocaleLowerCase().includes(searchText);
    });
  }

}
