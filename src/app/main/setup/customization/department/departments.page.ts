import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { map, takeUntil } from 'rxjs/operators';
import { DepartmentInfo } from 'src/app/models';
import { ApiService, ApiUrl, DictionaryService } from 'src/app/services';
import {
  DefaultTableCell,
  TableColumnInfo,
  TableDataSource,
} from '../../../components/table';
import { createBreadcrumb, DataTablePage, Page } from '../../../page';

export class DepartmentTableCell extends DefaultTableCell {
  getLink(column: TableColumnInfo, info: DepartmentInfo): string {
    if (column.name === 'levelName') {
      return '/setup/customization/department-info/' + info.levelId;
    }
    return '';
  }
}

@Component({
  templateUrl: './departments.page.html',
  styleUrls: ['./departments.page.scss'],
})
export class DepartmentsPage
  extends DataTablePage<DepartmentInfo>
  implements OnInit, OnDestroy
{
  constructor(
    private cdRef: ChangeDetectorRef,
    private apiService: ApiService,
    private dictionaryService: DictionaryService,
    private router: Router
  ) {
    super();

    this.subTitles = [
      createBreadcrumb('Customization', '/setup/customization'),
      createBreadcrumb('Departments', undefined, true),
    ];
    this.rightLinkUrl = ApiUrl.departments_right_links;
    this.columns = this.apiService.get<TableColumnInfo[]>(
      ApiUrl.department_table_columns
    );
    this.addButtonTooltip =
      this.dictionaryService.getTranslationOrWord('New Departments');
  }

  ngOnInit(): void {
    this.apiService
      .get<DepartmentInfo[]>(ApiUrl.departments)
      .pipe(
        map((data) => {
          this.dataSource = new TableDataSource(
            data,
            new DepartmentTableCell(),
            data.length
          );
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

  createDepartment() {
    this.router.navigateByUrl('/setup/customization/new-department');
  }
}
