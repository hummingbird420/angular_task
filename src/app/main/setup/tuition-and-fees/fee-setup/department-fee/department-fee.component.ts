import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { take, takeUntil } from 'rxjs/operators';
import {
  DefaultTableCell,
  TableColumnInfo,
} from 'src/app/main/components/table';
import { DepartmentFeeInfo } from 'src/app/models';
import { AlertService, ApiService, DictionaryService } from 'src/app/services';
import { DialogService } from 'src/app/services/dialog.service';
import { FeeComponent } from '../fee.component';
import { AddEditDepartmentFeeComponent } from './add-edit-department-fee.component';

export class DepartmentFeeTableCell extends DefaultTableCell {
  getValue(column: TableColumnInfo, info: DepartmentFeeInfo): string | number {
    switch (column.name) {
      case 'curriculum':
        return info.curriculumName;
      case 'batchNumber':
        return info.batchNumber;

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
  selector: 'o-department-fee',
  templateUrl: './../fee.component.html',
})
export class DepartmentFeeComponent
  extends FeeComponent<DepartmentFeeInfo>
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
    this.addButtonTooltip =
      this.dictionaryService.getTranslationOrWord('New Department Fee');

    this.getColumns('department-fee-datatable-columns');
    this.infoMessage =
      'Applies to students taking courses from selected departments';
  }
  ngOnDestroy(): void {
    this.destroyed();
  }
  ngOnInit(): void {
    this.getFees('department-fees');
    this.tableCell
      .getAction()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data) => {
        if (data.type === 'EDIT') {
          this.openAddEditDialog(data.info.departmentFeeId);
        } else if (data.type === 'DELETE') {
          this.deleteFee(data.info.departmentFeeId);
        }
      });
  }
  createNew() {
    this.openAddEditDialog(0);
  }

  openAddEditDialog(feeId: number) {
    const options = DialogService.getOptions();
    options.data = {
      feeId: feeId,
      semesterId: this.selectedSemesterId,
    };

    const dialogRef = this.dialog.open(AddEditDepartmentFeeComponent, options);
    dialogRef.componentInstance.getActionListner().subscribe((data) => {
      this.getFees('department-fees');
    });
  }

  deleteFee(feeId: number) {
    this.dialogService.confirmDelete(() => {
      this.apiService
        .get(this.createUrl('fee/delete-department-fee', feeId))
        .pipe(take(1))
        .subscribe((data) => {
          this.getFees('department-fees');
          this.alertService.showSuccessAlert(
            'Department fee deleted successfully.'
          );
        });
    });
  }
}
