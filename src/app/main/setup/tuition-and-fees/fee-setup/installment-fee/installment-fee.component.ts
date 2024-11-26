import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  DefaultTableCell,
  TableColumnInfo,
} from 'src/app/main/components/table';
import { InstallmentFeeInfo } from 'src/app/models';
import { ApiService, DictionaryService } from 'src/app/services';
import { FeeComponent } from '../fee.component';

export class InstallmentFeeTableCell extends DefaultTableCell {
  getValue(column: TableColumnInfo, info: InstallmentFeeInfo): string | number {
    switch (column.name) {
      case 'amount':
        return info.fee;

      default:
        return super.getValue(column, info);
    }
  }
}

@Component({
  selector: 'o-installment-fee',
  templateUrl: './../fee.component.html',
})
export class InstallmentFeeComponent
  extends FeeComponent<InstallmentFeeInfo>
  implements OnInit, OnDestroy
{
  constructor(
    private dictionaryService: DictionaryService,
    protected apiService: ApiService
  ) {
    super(apiService);
    this.addButtonTooltip = this.dictionaryService.getTranslationOrWord(
      'New Installment Fee'
    );

    this.getColumns('installment-fee-datatable-columns');
    this.infoMessage = 'Applies to all students';
  }
  ngOnDestroy(): void {
    this.destroyed();
  }
  ngOnInit(): void {
    this.getFees('installment-fees');
  }
  createNew() {}
}
