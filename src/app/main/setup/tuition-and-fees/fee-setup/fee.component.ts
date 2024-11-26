import { Component, Input, OnDestroy } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, map, switchMap, takeUntil } from 'rxjs/operators';
import {
  DefaultTableCell,
  TableCell,
  TableColumnInfo,
  TableDataSource,
} from 'src/app/main/components/table';
import { DataTablePage } from 'src/app/main/page';
import { ApiService } from 'src/app/services';

@Component({ template: `<p>This is base component for fee setup</p>` })
export class FeeComponent<F> extends DataTablePage<F> implements OnDestroy {
  @Input() semesterId: Observable<number> = of(0);
  selectedSemesterId: number = 0;
  tableCell: TableCell<any> = new DefaultTableCell();
  infoMessage = '';

  constructor(protected apiService: ApiService) {
    super();
    this.actionColumn = 'Y';
  }
  ngOnDestroy(): void {
    this.destroyed();
  }

  getColumns(apiUrl: string) {
    this.columns = this.apiService
      .get<TableColumnInfo[]>(`fee/${apiUrl}`)
      .pipe(delay(0));
  }

  getFees(apiUrl: string) {
    this.semesterId
      .pipe(
        delay(0),
        switchMap((data) => {
          this.selectedSemesterId = data;
          return this.apiService
            .get<F[]>(this.createUrl(`fee/${apiUrl}`, data))
            .pipe(
              map((data) => {
                this.dataSource = new TableDataSource(data, this.tableCell);
                return data;
              })
            );
        }),
        takeUntil(this.destroyed$)
      )
      .subscribe((data) => {
        this.dataSource = new TableDataSource(data, this.tableCell);
      });
  }
  createNew() {}
}
