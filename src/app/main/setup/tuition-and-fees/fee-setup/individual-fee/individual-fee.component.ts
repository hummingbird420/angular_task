import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { take, takeUntil } from 'rxjs/operators';
import {
  DefaultTableCell,
  TableColumnInfo,
} from 'src/app/main/components/table';
import { IndividualFeeInfo } from 'src/app/models';
import { AlertService, ApiService, DictionaryService } from 'src/app/services';
import { DialogService } from 'src/app/services/dialog.service';
import { FeeComponent } from '../fee.component';
import { AddEditIndividualFeeComponent } from './add-edit-individual-fee.component';

export class IndividualFeeTableCell extends DefaultTableCell {
  getValue(column: TableColumnInfo, info: IndividualFeeInfo): string | number {
    switch (column.name) {
      case 'feeName':
        return info.feeName;
      case 'amount':
        return info.fee;

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
  selector: 'o-individual-fee',
  templateUrl: './../fee.component.html',
})
export class IndividualFeeComponent
  extends FeeComponent<IndividualFeeInfo>
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
      this.dictionaryService.getTranslationOrWord('New Individual Fee');

    this.getColumns('individual-fee-datatable-columns');
    this.infoMessage = 'Applies only to chosen students';
  }
  ngOnDestroy(): void {
    this.destroyed();
  }
  ngOnInit(): void {
    this.getFees('individual-fees');
    this.tableCell
      .getAction()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data) => {
        if (data.type === 'EDIT') {
          this.openAddEditDialog(data.info.feeStudentReltnId);
        } else if (data.type === 'DELETE') {
          this.deleteFee(data.info.feeStudentReltnId);
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

    const dialogRef = this.dialog.open(AddEditIndividualFeeComponent, options);
    dialogRef.componentInstance.getActionListner().subscribe((data) => {
      this.getFees('individual-fees');
    });
  }

  deleteFee(feeId: number) {
    this.dialogService.confirmDelete(() => {
      this.apiService
        .get(this.createUrl('fee/delete-individual-fee', feeId))
        .pipe(take(1))
        .subscribe((data) => {
          this.getFees('individual-fees');
          this.alertService.showSuccessAlert(
            'Individual fee deleted successfully.'
          );
        });
    });
  }
}
