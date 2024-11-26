import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { take, takeUntil } from 'rxjs/operators';
import {
  DefaultTableCell,
  TableColumnInfo,
} from 'src/app/main/components/table';
import { DepartmentCourseFeeInfo } from 'src/app/models';
import { AlertService, ApiService, DictionaryService } from 'src/app/services';
import { DialogService } from 'src/app/services/dialog.service';
import { FeeComponent } from '../fee.component';
import { AddEditDepartmentCourseFeeComponent } from './add-edit-department-course-fee.component';

export class DepartmentCourseFeeTableCell extends DefaultTableCell {
  getValue(
    column: TableColumnInfo,
    info: DepartmentCourseFeeInfo
  ): string | number {
    switch (column.name) {
      case 'curriculum':
        return info.curriculumName;

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
        return '';
    }
  }
}

@Component({
  selector: 'o-department-course-fee',
  templateUrl: './../fee.component.html',
})
export class DepartmentCourseFeeComponent
  extends FeeComponent<DepartmentCourseFeeInfo>
  implements OnInit, OnDestroy
{
  constructor(
    private dialog: MatDialog,
    private dictionaryService: DictionaryService,
    protected apiService: ApiService,
    private dialogService: DialogService,
    private alertService: AlertService
  ) {
    super(apiService);
    this.addButtonTooltip = this.dictionaryService.getTranslationOrWord(
      'New Department Course Fee'
    );

    this.getColumns('department-course-fee-datatable-columns');
    this.infoMessage =
      'Applies to students enrolled in the selected departments';
  }
  ngOnDestroy(): void {
    this.destroyed();
  }
  ngOnInit(): void {
    this.getFees('department-course-fees');
    this.tableCell
      .getAction()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data) => {
        if (data.type === 'EDIT') {
          this.openAddEditDialog(data.info.levelCourseFeeId);
        } else if (data.type === 'DELETE') {
          this.deleteFee(data.info.levelCourseFeeId);
        }
      });
  }
  createNew() {
    const options = {
      data: {
        feeId: 0,
      },
    };
    this.dialog.open(AddEditDepartmentCourseFeeComponent, options);
  }

  openAddEditDialog(feeId: number) {
    const options = DialogService.getOptions();
    options.data = {
      feeId: feeId,
      semesterId: this.selectedSemesterId,
    };

    const dialogRef = this.dialog.open(
      AddEditDepartmentCourseFeeComponent,
      options
    );
    dialogRef.componentInstance.getActionListner().subscribe((data) => {
      this.getFees('department-course-fees');
    });
  }

  deleteFee(feeId: number) {
    this.dialogService.confirmDelete(() => {
      this.apiService
        .get(this.createUrl('fee/delete-department-course-fee', feeId))
        .pipe(take(1))
        .subscribe((data) => {
          this.getFees('department-course-fees');
          this.alertService.showSuccessAlert(
            'Department course fee deleted successfully.'
          );
        });
    });
  }
}
