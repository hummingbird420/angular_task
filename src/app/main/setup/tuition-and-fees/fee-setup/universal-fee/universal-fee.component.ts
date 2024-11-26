import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { take, takeUntil } from 'rxjs/operators';
import {
  DefaultTableCell,
  TableColumnInfo,
} from 'src/app/main/components/table';
import { CourseFeeInfo, UniversalFeeInfo } from 'src/app/models';
import { AlertService, ApiService, DictionaryService } from 'src/app/services';
import { DialogService } from 'src/app/services/dialog.service';
import { FeeComponent } from '../fee.component';
import { AddEditUniversalFeeComponent } from './add-edit-universal-fee.component';

export class UniversalFeeTableCell extends DefaultTableCell {
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
  selector: 'o-universal-fee',
  templateUrl: './../fee.component.html',
})
export class UniversalFeeComponent
  extends FeeComponent<UniversalFeeInfo>
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
      this.dictionaryService.getTranslationOrWord('New Universal Fee');
    this.getColumns('universal-fee-datatable-columns');
    this.infoMessage = 'Applies to all students';
  }
  ngOnDestroy(): void {
    this.destroyed();
  }
  ngOnInit(): void {
    this.getFees('universal-fees');
    this.tableCell
      .getAction()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data) => {
        if (data.type === 'EDIT') {
          this.openAddEditDialog(data.info.universalFeeId);
        } else if (data.type === 'DELETE') {
          this.deleteFee(data.info.universalFeeId);
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

    const dialogRef = this.dialog.open(AddEditUniversalFeeComponent, options);
    dialogRef.componentInstance.getActionListner().subscribe((data) => {
      this.getFees('universal-fees');
    });
  }

  deleteFee(feeId: number) {
    this.dialogService.confirmDelete(() => {
      this.apiService
        .get(this.createUrl('fee/delete-universal-fee', feeId))
        .pipe(take(1))
        .subscribe((data) => {
          this.getFees('universal-fees');
          this.alertService.showSuccessAlert(
            'Chosen course fee deleted successfully.'
          );
        });
    });
  }
}
