import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MatDateFormats, MAT_DATE_FORMATS } from '@angular/material/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { StartPageQueryInfo } from 'src/app/models/start-page-query.info';
import { ApiService, AuthService } from 'src/app/services';
import { TableColumnInfo, TableDataSource } from '../../components/table';
import { createBreadcrumb, Page } from '../../page';

@Component({
  templateUrl: './start-page-setup.page.html',
  styleUrls: ['./start-page-setup.page.scss'],
})
export class StartPageSetupPage extends Page implements OnInit {
  columns: Observable<TableColumnInfo[]> = of([]);
  dataSource: TableDataSource<StartPageQueryInfo> =
    new TableDataSource<StartPageQueryInfo>();
  constructor(
    private cdRef: ChangeDetectorRef,
    private apiService: ApiService,
    private authService: AuthService,
    private router: Router,
    @Inject(MAT_DATE_FORMATS) private dateFormats: MatDateFormats
  ) {
    super();
    this.subTitles = [createBreadcrumb('Start Page Setup', undefined, true)];
    this.setDateFormat(this.dateFormats, this.authService);
    this.columns = this.apiService.get<TableColumnInfo[]>(
      'start-page-datatable-columns'
    );
  }

  ngOnInit(): void {
    this.apiService
      .get<StartPageQueryInfo[]>('start-page-queries')
      .pipe(
        map((data) => {
          this.dataSource = new TableDataSource(data);
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

  createStartPageQuery() {
    this.router.navigateByUrl('/setup/new-start-page-query');
  }
}
