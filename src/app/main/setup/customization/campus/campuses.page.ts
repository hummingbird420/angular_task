import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';
import { SortedFieldInfo } from 'src/app/models';
import { CampusInfo } from 'src/app/models/campus.info';
import { ApiService, ApiUrl, DictionaryService } from 'src/app/services';

import {
  DefaultTableCell,
  TableColumnInfo,
  TableDataSource,
} from '../../../components/table';
import { createBreadcrumb, Page } from '../../../page';

export class CampusTableCell extends DefaultTableCell {
  constructor(private dictionaryService: DictionaryService) {
    super();
  }
  getLink(column: TableColumnInfo, info: CampusInfo): string {
    if (column.name === 'campusName') {
      return '/setup/customization/campus-info/' + info.campusId;
    }
    return '';
  }
  getValue(column: TableColumnInfo, info: any): string | number {
    if (column.name == 'statusText') {
      return info.isActive == 1
        ? this.dictionaryService.getTranslationOrWord('Active')
        : info.isActive == 2
        ? this.dictionaryService.getTranslationOrWord('Archived')
        : '';
    } else {
      return super.getValue(column, info);
    }
  }
}

@Component({
  templateUrl: './campuses.page.html',
  styleUrls: ['./campuses.page.scss'],
})
export class CampusesPage extends Page implements OnInit, OnDestroy {
  columns: Observable<TableColumnInfo[]> = of([]);
  dataSource: TableDataSource<CampusInfo> = new TableDataSource<CampusInfo>();
  campuses: MatTableDataSource<CampusInfo> = new MatTableDataSource();
  status: number = 1;
  addButtonTooltip: string =
    this.dictionaryService.getTranslationOrWord('New Campus');
  campusStatusDropdown: SortedFieldInfo<number, number> = {} as SortedFieldInfo<
    number,
    number
  >;
  tableCell: CampusTableCell = new CampusTableCell(this.dictionaryService);
  constructor(
    private router: Router,
    private cdRef: ChangeDetectorRef,
    private dictionaryService: DictionaryService,
    private apiService: ApiService
  ) {
    super();

    this.subTitles = [
      createBreadcrumb('Customization', '/setup/customization'),
      createBreadcrumb('Campuses', undefined, true),
    ];
    this.rightLinkUrl = 'campus/right-links';
    this.columns = this.apiService
      .get<TableColumnInfo[]>('campus/datatable-columns')
      .pipe(takeUntil(this.destroyed$));
  }
  ngOnDestroy(): void {
    this.destroyed();
  }

  ngOnInit(): void {
    this.apiService
      .get<SortedFieldInfo<number, number>>('campus/status-dropdown')
      .pipe(
        switchMap((statusDropdown) => {
          this.campusStatusDropdown = statusDropdown;
          return this.getCampuses(statusDropdown.fieldValue);
        }),
        takeUntil(this.destroyed$)
      )
      .subscribe((data) => {
        this.dataSource = new TableDataSource(data, this.tableCell);
        this.cdRef.detectChanges();
      });
  }

  getCampuses(status: number) {
    return this.apiService.get<CampusInfo[]>(
      this.createUrl(ApiUrl.campuses, status)
    );
  }

  onStatusChange(status: number) {
    this.getCampuses(status)
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data) => {
        this.dataSource = new TableDataSource(data, this.tableCell);
        this.cdRef.detectChanges();
      });
  }

  createCampus() {
    this.router.navigateByUrl('/setup/customization/new-campus');
  }
}
