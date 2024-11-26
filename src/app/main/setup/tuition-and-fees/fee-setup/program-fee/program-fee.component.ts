import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { take, takeUntil } from 'rxjs/operators';
import {
  DefaultTableCell,
  TableColumnInfo,
} from 'src/app/main/components/table';
import { ProgramFeeInfo } from 'src/app/models';
import { AlertService, ApiService, DictionaryService } from 'src/app/services';
import { DialogService } from 'src/app/services/dialog.service';
import { FeeComponent } from '../fee.component';
import { AddEditProgramFeeComponent } from './add-edit-program-fee.component';

export class ProgramFeeTableCell extends DefaultTableCell {
  getValue(column: TableColumnInfo, info: ProgramFeeInfo): string | number {
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
        return super.getValue(column, info);
    }
  }
}

@Component({
  selector: 'o-program-fee',
  templateUrl: './../fee.component.html',
})
export class ProgramFeeComponent
  extends FeeComponent<ProgramFeeInfo>
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
      this.dictionaryService.getTranslationOrWord('New Program Fee');

    this.getColumns('program-fee-datatable-columns');
    this.infoMessage =
      'Applies to students enrolled in the selected programs' +
      "<br/>These rates will be taken from the student's program" +
      ' starting semester if a semester is chosen on the registration record.' +
      " Otherwise, the current semester's rates will be used.";
  }
  ngOnDestroy(): void {
    this.destroyed();
  }
  ngOnInit(): void {
    this.getFees('program-fees');
    this.tableCell
      .getAction()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data) => {
        if (data.type === 'EDIT') {
          this.openAddEditDialog(data.info.programmeFeeId);
        } else if (data.type === 'DELETE') {
          this.deleteFee(data.info.programmeFeeId);
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

    const dialogRef = this.dialog.open(AddEditProgramFeeComponent, options);
    dialogRef.componentInstance.getActionListner().subscribe((data) => {
      this.getFees('program-fees');
    });
  }

  deleteFee(feeId: number) {
    this.dialogService.confirmDelete(() => {
      this.apiService
        .get(this.createUrl('fee/delete-program-fee', feeId))
        .pipe(take(1))
        .subscribe((data) => {
          this.getFees('program-fees');
          this.alertService.showSuccessAlert(
            'Program fee deleted successfully.'
          );
        });
    });
  }
}
