import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { SortedFieldInfo } from 'src/app/models';
import { SubjectInfo } from 'src/app/models/subject.info';
import { ApiService, ApiUrl } from 'src/app/services';
import {
  TableCell,
  TableColumnInfo,
  TableDataSource,
} from '../../../components/table';
import { createBreadcrumb, Page } from '../../../page';

export class CourseTableCell extends TableCell<SubjectInfo> {
  getValue(column: TableColumnInfo, info: SubjectInfo): string | number {
    switch (column.name) {
      case 'courseNumber':
        return info.courseNumber;
      case 'subject':
        return info.subject;
      case 'creditUnit':
        return info.creditUnit;
      case 'faUnit':
        return info.faUnit;
      case 'contEduUnit':
        return info.contEduUnit;
      case 'instructHour':
        return info.instructHour;
      case 'clinicalHour':
        return info.clinicalHour;
      case 'labHour':
        return info.labHour;
      case 'gradingType':
        return info.gradingType;
      case 'courseCategoryId':
        return info.courseCategoryId;
      default:
        return '';
    }
  }

  getLink(column: TableColumnInfo, info: SubjectInfo): string {
    if (column.name === 'courseNumber') {
      return '/setup/customization/course-info/' + info.courseId;
    }
    return '';
  }
}

@Component({
  templateUrl: './courses.page.html',
  styleUrls: ['./courses.page.scss'],
})
export class CoursesPage extends Page implements OnInit {
  levelId: number = 0;
  curriculumId: number = 0;
  curriculumField: SortedFieldInfo<number, string>;
  departmentField: SortedFieldInfo<number, string>;
  isLoaded: boolean = false;
  columns: Observable<TableColumnInfo[]> = of([]);
  dataSource: TableDataSource<SubjectInfo> = new TableDataSource<SubjectInfo>();

  constructor(
    private cdRef: ChangeDetectorRef,
    private router: Router,
    private apiService: ApiService
  ) {
    super();

    this.subTitles = [
      createBreadcrumb('Customization', '/setup/customization'),
      createBreadcrumb('Courses/Modules', undefined, true),
    ];
    this.rightLinkUrl = ApiUrl.subjects_right_links;
    this.curriculumField = {} as SortedFieldInfo<number, string>;
    this.departmentField = {} as SortedFieldInfo<number, string>;
    this.apiService
      .get<SortedFieldInfo<number, string>>(
        ApiUrl.curriculum_dropdown + this.curriculumId
      )
      .toPromise()
      .then((field) => {
        this.curriculumField = field;
        this.curriculumId = field.fieldValue;
        if (!this.isLoaded) {
          this.getCourses();
        }
      });

    this.apiService
      .get<SortedFieldInfo<number, string>>(
        ApiUrl.department_dropdown + this.levelId
      )
      .toPromise()
      .then((field) => {
        this.departmentField = field;
        this.levelId = field.fieldValue;
        if (!this.isLoaded) {
          this.getCourses();
        }
      });

    this.columns = this.apiService.get<TableColumnInfo[]>(
      ApiUrl.subject_table_columns
    );
  }

  ngOnInit(): void {
    if (!this.isLoaded) {
      this.getCourses();
    }
  }

  getCourses() {
    this.apiService
      .get<SubjectInfo[]>(
        ApiUrl.subjects + this.curriculumId + '/' + this.levelId
      )
      .pipe(
        map((data) => {
          this.dataSource = new TableDataSource<SubjectInfo>(
            data,
            new CourseTableCell()
          );
          this.isLoaded = true;
        }),
        takeUntil(this.destroyed$)
      )
      .subscribe((data) => this.cdRef.detectChanges());
  }

  createNew() {
    this.router.navigateByUrl('/setup/customization/new-course');
  }
}
