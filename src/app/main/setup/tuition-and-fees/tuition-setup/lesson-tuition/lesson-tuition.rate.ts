import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { take, takeUntil } from 'rxjs/operators';
import {
  DefaultTableCell,
  TableColumnInfo,
} from 'src/app/main/components/table';
import { LessonTuitionRateInfo } from 'src/app/models/tuition-rate.info';
import { AlertService, ApiService, DictionaryService } from 'src/app/services';
import { DialogService } from 'src/app/services/dialog.service';
import { TuitionComponent } from '../tuition.component';
import { AddEditLessonTuitionDialog } from './add-edit-lesson-tuition.dialog';

export class LessionTuitionRateTableCell extends DefaultTableCell {
  getValue(
    column: TableColumnInfo,
    info: LessonTuitionRateInfo
  ): string | number {
    switch (column.name) {
      case 'curriculum':
        return info.curriculumName;
      case 'department':
        return info.departmentName;
      case 'course':
        return info.courseName;
      case 'lessonType':
        return info.lessonTypeTitle;
      default:
        return super.getValue(column, info);
    }
  }
}

@Component({
  selector: 'o-lesson-tuition',
  templateUrl: './../tuition.component.html',
})
export class LessonTuitionRate
  extends TuitionComponent<LessonTuitionRateInfo>
  implements OnInit
{
  constructor(
    protected apiService: ApiService,
    private dialog: MatDialog,
    private dictionaryService: DictionaryService,
    private dialogService: DialogService,
    private alertService: AlertService
  ) {
    super(apiService);
    this.addButtonTooltip = this.dictionaryService.getTranslationOrWord(
      'New Tuition Rate per Lesson'
    );
    this.tableCell = new LessionTuitionRateTableCell();
    this.getColumns('lesson-tuition-datatable-columns');
  }

  ngOnInit(): void {
    this.getTuitions('lesson-tuition-rates');
    this.tableCell
      .getAction()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data) => {
        if (data.type === 'EDIT') {
          this.openAddEditDialog(data.info, true);
        } else if (data.type === 'DELETE') {
          this.deleteFee(data.info.lessonTuitionRateId);
        }
      });
  }
  openAddEditDialog(info: LessonTuitionRateInfo, edit?: boolean) {
    const options = DialogService.getOptions();
    options.data = {
      semesterId: info.semesterId,
      levelId: info.levelId,
      curriculumId: info.curriculumId,
      lessonType: info.lessonType,
      edit: edit,
    };

    const dialogRef = this.dialog.open(AddEditLessonTuitionDialog, options);
    dialogRef.componentInstance.getActionListner().subscribe((data) => {
      this.getTuitions('lesson-tuition-rates');
    });
  }
  deleteFee(tuitionRateId: number) {
    this.dialogService.confirmDelete(() => {
      this.apiService
        .get(
          this.createUrl('tuition/delete-lesson-tuition-rate', tuitionRateId)
        )
        .pipe(take(1))
        .subscribe((data) => {
          this.getTuitions('lesson-tuition-rates');
          this.alertService.showSuccessAlert(
            'Lesson tuition rate deleted successfully.'
          );
        });
    });
  }

  createNew() {
    this.openAddEditDialog({
      semesterId: this.selectedSemesterId,
      levelId: 0,
      curriculumId: -1,
      lessonType: -1,
    } as LessonTuitionRateInfo);
  }
}
