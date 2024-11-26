import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { delay, takeUntil } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { DefaultTableCell } from './table-cell';
import { TableColumnInfo } from './table-column.info';
import { TableDataSource } from './table-datasource';

@Component({
  selector: 'o-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent<T> implements OnInit, OnDestroy, AfterViewInit, OnChanges {
  @Input() showActionCol: boolean = false;
  @Input() addButtonTooltip: string = 'New';
  @Input() hideAddButton: boolean = false;
  @Input() pageSize: number = 3;
  @Input() dataSource: TableDataSource<T> = new TableDataSource<T>();
  @Input() dateFormat: string = 'yyyy-dd-MM';
  @Input() columns: Observable<TableColumnInfo[]> | TableColumnInfo[] = [];

  showTotalPages = 10;

  updatedColumns: TableColumnInfo[] = [];

  displayedColumns: string[] = [];
  totalRows: number = 0;
  hidePaginator: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  actionColumn = {
    performAction: (type: string, info: T) => this.dataSource.getTableCell().performAction(type, info),
  };

  @Output() clickAdd: EventEmitter<void> = new EventEmitter<void>();
  destroyed$: Subject<void> = new Subject<void>();

  @ViewChild(MatPaginator) set paginator(paginator: MatPaginator) {
    if (!this.dataSource.paginator) {
      this.dataSource.paginator = paginator;
      setTimeout(() => {
        if (this.dataSource.paginator) {
          this.dataSource.paginator.page.emit({
            length: this.dataSource.getTotalRows(),
            pageIndex: this.dataSource.paginator.pageIndex,
            pageSize: this.dataSource.paginator.pageSize,
          });
          this.hidePaginator.next(this.dataSource.paginator.getNumberOfPages() <= 1);
        }
      });
    }
  }

  @ViewChild(MatSort) set matSort(sort: MatSort) {
    if (!this.dataSource.sort) {
      this.dataSource.sort = sort;
    }
  }
  constructor(protected cdRef: ChangeDetectorRef) {}
  ngOnChanges(changes: SimpleChanges): void {
    // console.log(this.actionColumn);
  }
  ngAfterViewInit(): void {}

  ngOnInit(): void {
    if (this.columns instanceof Observable) {
      this.columns.pipe(delay(0), takeUntil(this.destroyed$)).subscribe((columns) => this.updateCols(columns));
    } else if (Array.isArray(this.columns)) {
      this.updateCols(this.columns);
    }
  }
  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
  updateCols(columns: TableColumnInfo[]) {
    const temCols = [];
    console.log(columns);

    for (let i = 0; i < columns.length; i++) {
      const inputColumn = columns[i];
      const column = {
        name: inputColumn.name,
        title: inputColumn.title.toUpperCase(),
        type: this.dataSource.getTableCell().getDataType(inputColumn),
        alignment: inputColumn.alignment,
        cell: (info: T) => this.dataSource.getTableCell().getValue(inputColumn, info),
        link: (info: T) => this.dataSource.getTableCell().getLink(inputColumn, info),
        action: (type: string, info: T) => this.dataSource.getTableCell().performAction(type, info),
      };
      temCols.push(column);
    }

    this.updatedColumns = temCols;
    this.totalRows = this.dataSource.getTotalRows();
    this.displayedColumns = this.updatedColumns.map((c) => c.name);
    if (this.showActionCol) this.displayedColumns.push('action');
    this.cdRef.detectChanges();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.length = this.dataSource.filteredData.length;
      this.dataSource.paginator.page.next({
        length: this.dataSource.filteredData.length,
        pageIndex: 0,
        pageSize: 0,
        previousPageIndex: 0,
      });
      console.log(this.dataSource.paginator.getNumberOfPages());

      this.hidePaginator.next(this.dataSource.paginator.getNumberOfPages() <= 1);
    }
  }
  emitAddEvent() {
    this.clickAdd.emit();
  }

  getAlignment(alignment: 'LEFT' | 'CENTER' | 'RIGHT') {
    switch (alignment) {
      case 'RIGHT':
        return 'rta';
      case 'CENTER':
        return 'cta';
      default:
        return 'lta';
    }
  }

  getArrowPosition(alignment: 'LEFT' | 'CENTER' | 'RIGHT') {
    return alignment === 'RIGHT' ? 'before' : 'after';
  }
}
