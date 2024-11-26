import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MatDateFormats, MAT_DATE_FORMATS } from '@angular/material/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { DepartmentInfo } from 'src/app/models';
import { SemesterInfo } from 'src/app/models/semester.info';
import { ApiService, ApiUrl, AuthService } from 'src/app/services';
import {
  DefaultTableCell,
  TableColumnInfo,
  TableDataSource,
} from '../../components/table';
import { createBreadcrumb, Page } from '../../page';

export class SemesterTableCell extends DefaultTableCell {
  getLink(column: TableColumnInfo, info: SemesterInfo): string {
    if (column.name === 'title') {
      return '/setup/semester-info/' + info.semesterId;
    }
    return '';
  }
}

@Component({
  templateUrl: './semesters.page.html',
  styleUrls: ['./semesters.page.scss'],
})
export class SemestersPage extends Page implements OnInit {
  columns: Observable<TableColumnInfo[]> = of([]);
  dataSource: TableDataSource<DepartmentInfo> =
    new TableDataSource<DepartmentInfo>();

  constructor(
    private cdRef: ChangeDetectorRef,
    private apiService: ApiService,
    private authService: AuthService,
    private router: Router,
    @Inject(MAT_DATE_FORMATS) private dateFormats: MatDateFormats
  ) {
    super();
    this.subTitles = [createBreadcrumb('Semesters', undefined, true)];
    this.setDateFormat(this.dateFormats, this.authService);
    this.columns = this.apiService.get<TableColumnInfo[]>(
      ApiUrl.semester_datatable_columns
    );
  }

  ngOnInit(): void {
    this.apiService
      .get<SemesterInfo[]>(ApiUrl.semesters)
      .pipe(
        map((data) => {
          this.dataSource = new TableDataSource(data, new SemesterTableCell());
          return data;
        }),
        takeUntil(this.destroyed$)
      )
      .subscribe((data) => {
        this.cdRef.detectChanges();
      });
  }

  ngOnDestroy(): void {
    this.destroyed();
  }

  createSemester() {
    this.router.navigateByUrl('/setup/new-semester');
  }
}
