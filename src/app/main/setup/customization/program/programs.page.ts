import {
  ChangeDetectorRef,
  Component,
  Inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDateFormats, MAT_DATE_FORMATS } from '@angular/material/core';
import { Router } from '@angular/router';
import { map, takeUntil } from 'rxjs/operators';
import { ProgramInfo, SortedFieldInfo } from 'src/app/models';
import {
  ApiService,
  ApiUrl,
  AuthService,
  DictionaryService,
} from 'src/app/services';
import {
  DefaultTableCell,
  TableColumnInfo,
  TableDataSource,
} from '../../../components/table';
import { createBreadcrumb, DataTablePage } from '../../../page';

export class ProgramTableCell extends DefaultTableCell {
  getLink(column: TableColumnInfo, info: ProgramInfo): string {
    if (column.name === 'programmeName') {
      return '/setup/customization/program-info/' + info.programId;
    }
    return '';
  }
}

@Component({
  templateUrl: './programs.page.html',
  styleUrls: ['./programs.page.scss'],
})
export class ProgramsPage
  extends DataTablePage<ProgramInfo>
  implements OnInit, OnDestroy
{
  curriculumId: FormControl = new FormControl(-1);
  levelId: FormControl = new FormControl(0);
  showDeleted: boolean = false;
  filterFields: SortedFieldInfo<number, string>[] = [];

  constructor(
    private cdRef: ChangeDetectorRef,
    private router: Router,
    private apiService: ApiService,
    private authService: AuthService,
    private dictionaryService: DictionaryService,
    @Inject(MAT_DATE_FORMATS) private dateFormats: MatDateFormats
  ) {
    super();
    this.subTitles = [
      createBreadcrumb('Customization', '/setup/customization'),
      createBreadcrumb('Programs', undefined, true),
    ];
    this.rightLinkUrl = ApiUrl.programs_right_links;
    this.setDateFormat(this.dateFormats, this.authService);
    this.columns = this.apiService.get<TableColumnInfo[]>(
      ApiUrl.program_datatable_columns
    );
    this.addButtonTooltip =
      this.dictionaryService.getTranslationOrWord('New Program');
    this.apiService
      .get<SortedFieldInfo<number, string>[]>(ApiUrl.program_filter_fields)
      .pipe(
        map((data) => {
          this.filterFields = data;
          for (let i = 0; i < this.filterFields.length; i++) {
            const field = this.filterFields[i];
            if (field.fieldName === 'curriculumId') {
              this.curriculumId.setValue(field.fieldValue, { onlySelf: true });
            } else if (field.fieldName === 'levelId') {
              this.levelId.setValue(field.fieldValue, { onlySelf: true });
            }
          }
        }),
        takeUntil(this.destroyed$)
      )
      .subscribe((data) => {
        this.getPrograms();
      });
  }

  ngOnDestroy(): void {
    this.destroyed();
  }

  ngOnInit(): void {}

  getFormControl(name: string) {
    if (name === 'curriculumId') {
      return this.curriculumId;
    }
    return this.levelId;
  }

  getPrograms() {
    let programsUrl = this.createUrl(
      ApiUrl.programs,
      this.curriculumId.value,
      this.levelId.value
    );
    programsUrl = this.addParams(programsUrl, {
      showDeleted: this.showDeleted ? 0 : 1,
    });
    this.apiService
      .get<ProgramInfo[]>(programsUrl)
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data) => {
        this.dataSource = new TableDataSource(data, new ProgramTableCell());
        this.cdRef.detectChanges();
      });
  }

  createProgram() {
    this.router.navigate(['/setup/customization/new-program']);
  }
}
