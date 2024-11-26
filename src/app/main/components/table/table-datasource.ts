import { MatTableDataSource } from '@angular/material/table';
import { DefaultTableCell, TableCell } from './table-cell';

export class TableDataSource<T> extends MatTableDataSource<T> {
  constructor(
    private tableData?: T[],
    private tableCell?: TableCell<T>,
    private totalRows?: number
  ) {
    super(tableData);
    if (!this.totalRows && this.tableData) {
      this.totalRows = this.tableData.length;
    }
  }

  getTableCell(): TableCell<T> {
    return this.tableCell ? this.tableCell : new DefaultTableCell();
  }

  getTotalRows(): number {
    return this.totalRows ? this.totalRows : this.data.length;
  }
}
