import {
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { take, takeUntil } from 'rxjs/operators';
import { AddEditDialog } from 'src/app/components/templates/dialogs/add-edit.dialog';
import {
  DefaultTableCell,
  TableColumnInfo,
  TableDataSource,
} from 'src/app/main/components/table';
import { CourseFeeInfo } from 'src/app/models';
import { AlertService, ApiService, DictionaryService } from 'src/app/services';
import { DialogService } from 'src/app/services/dialog.service';
import { FeeComponent } from '../fee.component';
import { AddEditCourseFeeDialog } from './add-edit-course-fee.dialog';

export class CourseFeeTableCell extends DefaultTableCell {
  getValue(column: TableColumnInfo, info: CourseFeeInfo): string | number {
    switch (column.name) {
      case 'curriculum':
        return info.curriculumName;
      case 'batchNumber':
        return info.batchNumber;
      case 'course':
        return info.courseName;
      case 'feeName':
        return info.feeName;
      case 'amount':
        return info.fee;
      case 'separate':
        return info.isSeparatePayment === 1 ? 'Yes' : 'No';
      case 'tax':
        return info.isTaxable === '1' ? 'Yes' : 'No';
      case 'certificateName':
        return info.t1098 === 1 ? 'Yes' : 'No';
      default:
        return super.getValue(column, info);
    }
  }
}

@Component({
  selector: 'o-course-fee',
  templateUrl: './../fee.component.html',
})
export class CourseFeeComponent
  extends FeeComponent<CourseFeeInfo>
  implements OnInit, OnDestroy
{
  constructor(
    protected apiService: ApiService,
    private dictionaryService: DictionaryService,
    private dialog: MatDialog,
    private dialogService: DialogService,
    private alertService: AlertService,
    private cdRef: ChangeDetectorRef
  ) {
    super(apiService);
    this.tableCell = new CourseFeeTableCell();
    this.addButtonTooltip =
      this.dictionaryService.getTranslationOrWord('New Course Fee');
    this.getColumns('course-fee-datatable-columns');
    this.actionColumn = 'Y';
    this.infoMessage = 'Applies to students taking the selected courses';
  }
  ngOnDestroy(): void {
    this.destroyed();
  }
  ngOnInit(): void {
    this.getFees('course-fees');
    this.tableCell
      .getAction()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data) => {
        if (data.type === 'EDIT') {
          this.openAddEditDialog(data.info.courseFeeId);
        } else if (data.type === 'DELETE') {
          this.deleteFee(data.info.courseFeeId);
        }
      });
  }
  createNew() {
    this.openAddEditDialog(0);
  }

  openAddEditDialog(feeId: number) {
    const options = DialogService.getOptions();
    options.data = {
      courseFeeId: feeId,
      semesterId: this.selectedSemesterId,
    };

    const dialogRef = this.dialog.open(AddEditCourseFeeDialog, options);
    dialogRef.componentInstance.getActionListner().subscribe((data) => {
      this.getFees('course-fees');
      dialogRef.close();
    });
  }

  deleteFee(courseFeeId: number) {
    this.dialogService.confirmDelete(() => {
      this.apiService
        .get(this.createUrl('delete-course-fee', courseFeeId))
        .pipe(take(1))
        .subscribe((data) => {
          this.getFees('course-fees');
          this.alertService.showSuccessAlert(
            'Course fee deleted successfully.'
          );
        });
    });
  }
}
