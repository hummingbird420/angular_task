import { formatCurrency, formatNumber } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { take } from 'rxjs/operators';
import {
  DefaultTableCell,
  TableColumnInfo,
} from 'src/app/main/components/table';
import { CourseTuitionRateInfo } from 'src/app/models/tuition-rate.info';
import { AlertService, ApiService, DictionaryService } from 'src/app/services';
import { DialogService } from 'src/app/services/dialog.service';
import { TuitionComponent } from '../tuition.component';
import { AddEditCourseTuitionDialog } from './add-edit-course-tuition.dialog';

export class CourseTuitionRateTableCell extends DefaultTableCell {
  private _currencySign: string;
  constructor(private currencySign?: string) {
    super();
    this._currencySign = this.currencySign ? this.currencySign : '$';
  }
  getValue(
    column: TableColumnInfo,
    info: CourseTuitionRateInfo
  ): string | number {
    switch (column.name) {
      case 'curriculum':
        return info.curriculumName;
      case 'department':
        return info.departmentName;
      case 'course':
        return info.courseName;
      case 'batchNumber':
        return info.batchNumber;
      case 'standardRate':
        return this.formatCurrency(info.rate, this._currencySign);
      default:
        return super.getValue(column, info);
    }
  }
}

@Component({
  selector: 'o-course-tuition',
  templateUrl: './../tuition.component.html',
})
export class CourseTuitionRate extends TuitionComponent<any> implements OnInit {
  constructor(
    protected apiService: ApiService,
    private dialog: MatDialog,
    private dictionaryService: DictionaryService,
    private dialogService: DialogService,
    private alertService: AlertService
  ) {
    super(apiService);
    this.addButtonTooltip = this.dictionaryService.getTranslationOrWord(
      'New Tuition Rate by Course'
    );
    this.tableCell = new CourseTuitionRateTableCell();
    this.getColumns('course-tuition-datatable-columns');
  }

  ngOnInit(): void {
    this.getTuitions('course-tuition-rates');
  }

  openAddEditDialog(info: CourseTuitionRateInfo, edit?: boolean) {
    const options = DialogService.getOptions();
    options.data = {
      semesterId: info.semesterId,
      levelId: info.levelId,
      curriculumId: info.curriculumId,
      batchNumber: info.batchNumber,
      subjectId: info.subjectId,
      edit: edit,
    };

    const dialogRef = this.dialog.open(AddEditCourseTuitionDialog, options);
    dialogRef.componentInstance.getActionListner().subscribe((data) => {
      this.getTuitions('course-tuition-rates');
    });
  }
  deleteFee(tuitionRateId: number) {
    this.dialogService.confirmDelete(() => {
      this.apiService
        .get(
          this.createUrl('tuition/delete-course-tuition-rate', tuitionRateId)
        )
        .pipe(take(1))
        .subscribe((data) => {
          this.getTuitions('course-tuition-rates');
          this.alertService.showSuccessAlert(
            'Course tuition rate deleted successfully.'
          );
        });
    });
  }

  createNew() {
    this.openAddEditDialog({
      semesterId: this.selectedSemesterId,
      levelId: 0,
      curriculumId: 0,
      batchNumber: '',
      subjectId: 0,
    } as CourseTuitionRateInfo);
  }
}
