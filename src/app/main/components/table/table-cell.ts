import { formatCurrency, formatNumber } from '@angular/common';
import { EventEmitter } from '@angular/core';
import { TableColumnInfo } from './table-column.info';

export abstract class TableCell<T> {
  private action: EventEmitter<{ type: string; info: T }> = new EventEmitter<{
    type: string;
    info: T;
  }>();
  getDataType(column: TableColumnInfo): string {
    return column.type ? column.type : 'TEXT';
  }

  abstract getValue(column: TableColumnInfo, info: T): string | number;

  getLink(column: TableColumnInfo, info: T): string {
    return '';
  }

  performAction(type: string, info: T) {
    this.action.emit({ type: type, info: info });
  }

  getAction() {
    return this.action.asObservable();
  }

  formatCurrency(value: number, currencySign: string) {
    return formatCurrency(value, 'en-US', currencySign, undefined, '1.2-2');
  }

  formatDecimal(value: number) {
    return formatNumber(value, 'en-US', '1.2-2');
  }
}

export class DefaultTableCell extends TableCell<any> {
  getValue(column: TableColumnInfo, info: any): string | number {
    const columnName = column.name;
    return info.hasOwnProperty(columnName) ? info[columnName] : '';
  }
}
