import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';
import { PairValue, SortedFieldInfo } from 'src/app/models';
import { ClassroomInfo } from 'src/app/models/classroom.info';
import { ApiService, ApiUrl, DictionaryService } from 'src/app/services';
import {
  DefaultTableCell,
  TableColumnInfo,
  TableDataSource,
} from '../../../components/table';
import { createBreadcrumb, Page } from '../../../page';

export class ClassroomTableCell extends DefaultTableCell {
  getLink(column: TableColumnInfo, info: ClassroomInfo): string {
    if (column.name === 'roomNumber') {
      return '/setup/customization/classroom-info/' + info.classroomId;
    }
    return '';
  }
}

@Component({
  templateUrl: './classrooms.page.html',
  styleUrls: ['./classrooms.page.scss'],
})
export class ClassroomsPage extends Page implements OnInit, OnDestroy {
  campusDropdown: SortedFieldInfo<number, string> = {} as SortedFieldInfo<
    number,
    string
  >;
  columns: Observable<TableColumnInfo[]> = of([]);
  dataSource: TableDataSource<ClassroomInfo> =
    new TableDataSource<ClassroomInfo>();
  addButtonTooltip: string =
    this.dictionaryService.getTranslationOrWord('New Classroom');
  allOption: PairValue<any, string> = { value: -1, title: '---' } as PairValue<
    any,
    string
  >;

  constructor(
    private cdRef: ChangeDetectorRef,
    private apiService: ApiService,
    private dictionaryService: DictionaryService,
    private router: Router
  ) {
    super();
    this.subTitles = [
      createBreadcrumb('Customization', '/setup/customization'),
      createBreadcrumb('Classrooms', undefined, true),
    ];
    this.columns = this.apiService
      .get<TableColumnInfo[]>(ApiUrl.classroom_datatable_columns)
      .pipe(takeUntil(this.destroyed$));
  }

  ngOnDestroy(): void {
    this.destroyed();
  }

  ngOnInit(): void {
    this.apiService
      .get<SortedFieldInfo<number, string>>(ApiUrl.campus_dropdown + 0)
      .pipe(
        switchMap((data) => {
          this.campusDropdown = data;
          this.campusDropdown.fieldValue = -1;
          this.onChangeCampus(this.campusDropdown.fieldValue);
          return of(data);
        }),
        takeUntil(this.destroyed$)
      )
      .subscribe((data) => {
        this.cdRef.detectChanges();
      });
  }

  onChangeCampus(campusCode: number) {
    console.log(campusCode);
    this.apiService
      .get<ClassroomInfo[]>(this.createUrl(ApiUrl.classrooms, campusCode))
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data) => {
        this.dataSource = new TableDataSource(data, new ClassroomTableCell());
        this.cdRef.detectChanges();
      });
  }

  createClassroom() {
    this.router.navigateByUrl('/setup/customization/new-classroom');
  }
}
