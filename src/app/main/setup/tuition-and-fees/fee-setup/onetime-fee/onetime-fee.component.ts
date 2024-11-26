import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { take, takeUntil } from 'rxjs/operators';
import {
  DefaultTableCell,
  TableColumnInfo,
} from 'src/app/main/components/table';
import { OneTimeFeeInfo } from 'src/app/models';
import { AlertService, ApiService, DictionaryService } from 'src/app/services';
import { DialogService } from 'src/app/services/dialog.service';
import { FeeComponent } from '../fee.component';
import { AddEditOnetimeFeeComponent } from './add-edit-onetime-fee.component';

export class OneTimeFeeTableCell extends DefaultTableCell {
  getValue(column: TableColumnInfo, info: OneTimeFeeInfo): string | number {
    switch (column.name) {
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
  selector: 'o-onetime-fee',
  templateUrl: './../fee.component.html',
})
export class OnetimeFeeComponent
  extends FeeComponent<OneTimeFeeInfo>
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
      this.dictionaryService.getTranslationOrWord('New One Time Fee');

    this.getColumns('one-time-fee-datatable-columns');
    this.infoMessage =
      'Applies to all students on first program enrolled semester.' +
      ' If there is no program enrolled semester, then applies on first invoice semester';
  }
  ngOnDestroy(): void {
    this.destroyed();
  }
  ngOnInit(): void {
    this.getFees('onetime-fees');
    this.tableCell
      .getAction()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data) => {
        if (data.type === 'EDIT') {
          this.openAddEditDialog(data.info.oneTimeFeeId);
        } else if (data.type === 'DELETE') {
          this.deleteFee(data.info.oneTimeFeeId);
        }
      });
  }
  createNew() {
    const options = {
      data: {
        feeId: 0,
      },
    };
    this.dialog.open(AddEditOnetimeFeeComponent, options);
  }

  openAddEditDialog(feeId: number) {
    const options = DialogService.getOptions();
    options.data = {
      feeId: feeId,
      semesterId: this.selectedSemesterId,
    };

    const dialogRef = this.dialog.open(AddEditOnetimeFeeComponent, options);
    dialogRef.componentInstance.getActionListner().subscribe((data) => {
      this.getFees('onetime-fees');
    });
  }

  deleteFee(feeId: number) {
    this.dialogService.confirmDelete(() => {
      this.apiService
        .get(this.createUrl('fee/delete-onetime-fee', feeId))
        .pipe(take(1))
        .subscribe((data) => {
          this.getFees('onetine-fees');
          this.alertService.showSuccessAlert(
            'Onetime fee deleted successfully.'
          );
        });
    });
  }
}
