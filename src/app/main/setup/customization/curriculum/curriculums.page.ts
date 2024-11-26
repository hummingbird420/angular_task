import {
  ChangeDetectorRef,
  Component,
  Inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { MatDateFormats, MAT_DATE_FORMATS } from '@angular/material/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CurriculumInfo } from 'src/app/models';
import {
  AuthService,
  ApiService,
  ApiUrl,
  DictionaryService,
} from 'src/app/services';
import {
  TableCell,
  TableColumnInfo,
  TableDataSource,
} from '../../../components/table';
import { createBreadcrumb, Page } from '../../../page';

export class CurriculumTableCell extends TableCell<CurriculumInfo> {
  getValue(column: TableColumnInfo, info: CurriculumInfo): string {
    switch (column.name) {
      case 'curriculumName':
        return info.curriculumName;
      case 'effectiveDate':
        return info.effectiveDate;
      case 'isExternalInstitute':
        return info.isExternalInstitute === 1 ? 'Yes' : 'No';
      default:
        return '';
    }
  }
  getLink(column: TableColumnInfo, info: CurriculumInfo) {
    let link: string = '';
    if (column.name === 'curriculumName') {
      link = '/setup/customization/curriculum/' + info.curriculumId;
    }
    return link;
  }
}

@Component({
  templateUrl: './curriculums.page.html',
  styleUrls: ['./curriculums.page.scss'],
})
export class CurriculumsPage extends Page implements OnInit, OnDestroy {
  columns: Observable<TableColumnInfo[]> = of([]);
  dataSource: TableDataSource<CurriculumInfo> =
    new TableDataSource<CurriculumInfo>();
  addButtonTooltip: string =
    this.dictionaryService.getTranslationOrWord('New Curriculum');
  constructor(
    private cdRef: ChangeDetectorRef,
    private apiService: ApiService,
    private authService: AuthService,
    private dictionaryService: DictionaryService,
    private router: Router,
    @Inject(MAT_DATE_FORMATS) private dateFormats: MatDateFormats
  ) {
    super();
    this.subTitles = [
      createBreadcrumb('Customization', '/setup/customization'),
      createBreadcrumb('Curriculums', undefined, true),
    ];
    this.setDateFormat(this.dateFormats, this.authService);
    this.columns = this.apiService.get<TableColumnInfo[]>(
      ApiUrl.curriculum_datatable_columns
    );
  }

  ngOnInit(): void {
    this.apiService
      .get<CurriculumInfo[]>(ApiUrl.curriculumns)
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data) => {
        this.dataSource = new TableDataSource(data, new CurriculumTableCell());
        this.cdRef.detectChanges();
      });
  }

  ngOnDestroy(): void {
    this.destroyed();
  }

  createNew() {
    this.router.navigateByUrl('/setup/customization/new-curriculum');
  }
}
