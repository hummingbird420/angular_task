import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { take, takeUntil } from 'rxjs/operators';
import { ApiService, DictionaryService } from 'src/app/services';
import { AddEditFeeComponent } from '../add-edit-fee.component';
@Component({
  selector: 'o-add-edit-individual-fee',
  templateUrl: './../add-edit-fee.component.html',
  styles: [],
})
export class AddEditIndividualFeeComponent
  extends AddEditFeeComponent
  implements OnInit
{
  constructor(
    private cdRef: ChangeDetectorRef,
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    protected dictionaryService: DictionaryService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    super(dictionaryService);
    const feeId = this.data.feeId ? this.data.feeId : 0;
    if (feeId) {
      this.addButtonLabel = 'Update';
      this.addIcon = 'update';
    }
    this.getFormFields(
      this.formBuilder,
      this.apiService,
      this.createUrl('fee/individual-fee-fields', feeId)
    )
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data) => {
        this.cdRef.detectChanges();
      });
  }

  ngOnInit(): void {}

  saveFee() {
    if (super.saveFee()) {
      const value = this.formGroup.value;
      value.individualFeeId = this.data.feeId;
      value.semesterId = this.data.semesterId;
      value.isSeparatePayment = this.formGroup.value.isSeparatePayment
        ? '1'
        : '0';
      value.isTaxable = value.isTaxable ? '1' : '0';
      value.t1098 = value.t1098 ? '1' : '0';

      console.log(value);
      this.apiService
        .post('fee/save-individual-fee', value)
        .pipe(take(1))
        .subscribe((data) => {
          this.actionListner.emit(true);
        });
    }

    return true;
  }
}
