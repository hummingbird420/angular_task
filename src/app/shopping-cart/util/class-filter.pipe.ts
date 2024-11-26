import { Pipe, PipeTransform } from '@angular/core';
import { ClassInfo, ColumnInfo } from '../models';
import { FormatClassInfoPipe } from './format-class-info.pipe';

@Pipe({
  name: 'classFilter',
})
export class ClassFilterPipe implements PipeTransform {
  constructor(private classInfoFormatter: FormatClassInfoPipe) {}
  transform(
    classes: ClassInfo[],
    columns: ColumnInfo[],
    others: string = '',
    searchText: string
  ): ClassInfo[] {
    if (classes && searchText) {
      searchText = searchText.toLocaleUpperCase();
      if (others && others.toLocaleUpperCase().includes(searchText)) {
        return classes;
      }
      return classes.filter((clazz: any) => {
        let found = false;
        for (const column of columns) {
          if (clazz.hasOwnProperty(column.name)) {
            let value = this.classInfoFormatter.transform(clazz, column.name);
            value = this.normalize(value);
            found = value.toLocaleUpperCase().includes(searchText);
            if (found) break;
          }
        }

        return found;
      });
    }
    return classes;
  }

  normalize(value: any): string {
    var tmp = document.createElement('DIV');
    tmp.innerHTML = value;
    return tmp.textContent || tmp.innerText || '';
  }
}
