import {
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, switchMap, takeUntil } from 'rxjs/operators';
import {
  DefaultTableCell,
  TableCell,
  TableColumnInfo,
  TableDataSource,
} from 'src/app/main/components/table';
import { DataTablePage } from 'src/app/main/page';
import { ApiService } from 'src/app/services';

@Component({ template: `<p>This is base component for tuition setup</p>` })
export class TuitionComponent<T> extends DataTablePage<T> implements OnDestroy {
  @Input() semesterId: Observable<number> = of(0);
  selectedSemesterId: number = 0;
  tableCell: TableCell<any> = new DefaultTableCell();
  constructor(protected apiService: ApiService) {
    super();
    this.actionColumn = 'Y';
  }
  ngOnDestroy(): void {
    this.destroyed();
  }

  getColumns(apiUrl: string) {
    this.columns = this.apiService
      .get<TableColumnInfo[]>(`tuition/${apiUrl}`)
      .pipe(delay(0));
  }
  getTuitions(apiUrl: string, cdRef?: ChangeDetectorRef) {
    this.semesterId
      .pipe(
        delay(0),
        switchMap((data) => {
          this.selectedSemesterId = data;
          return this.apiService.get<T[]>(
            this.createUrl(`tuition/${apiUrl}`, data)
          );
        }),
        takeUntil(this.destroyed$)
      )
      .subscribe((data) => {
        this.dataSource = new TableDataSource(data, this.tableCell);
        cdRef?.detectChanges();
      });
  }
  createNew() {}
}
