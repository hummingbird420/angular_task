import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { map } from 'rxjs/operators';
import { SortedFieldInfo } from 'src/app/models';
import { ApiService, DictionaryService } from 'src/app/services';
import { FormField } from 'src/app/util/utility-funtions';
import { AddEditFeeComponent } from '../add-edit-fee.component';

@Component({
  selector: 'o-add-edit-installment-fee',
  templateUrl: './../add-edit-fee.component.html',
  styles: [],
})
export class AddEditInstallmentFeeComponent
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
    this.getFormFields(
      this.formBuilder,
      this.apiService,
      this.createUrl('fee/installment-fee-fields', this.data.courseFeeId)
    ).subscribe((data) => {
      this.cdRef.detectChanges();
    });
  }

  ngOnInit(): void {}
}
