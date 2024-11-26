import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { take, takeUntil } from 'rxjs/operators';
import { ApiService, DictionaryService } from 'src/app/services';
import {
  AddEditTuitionComponent,
  ObjectType,
} from '../add-edit-tuition.component';

@Component({
  selector: 'o-add-edit-category-tuition',
  templateUrl: './../add-edit-tuition.component.html',
})
export class AddEditCategoryTuitionDialog
  extends AddEditTuitionComponent
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
    this.title = 'Add Category Tuition Rate';
    if (this.data.edit) {
      this.title = 'Edit Category Tuition Rate';
      this.addButtonLabel = 'Update';
      this.addIcon = 'update';
    }
    this.getFormFieldsByGet(
      this.formBuilder,
      this.apiService,
      this.createUrl(
        'tuition/category-tuition-rate-fields',
        this.data.semesterId,
        this.data.courseCategoryId
      )
    )
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data) => {
        this.cdRef.detectChanges();
      });
  }

  ngOnInit(): void {}

  saveTuition() {
    if (super.saveTuition()) {
      const value = this.formGroup.value;
      console.log(value);
      const tuitionRateInfo: ObjectType<string | number | Object> = {};
      const tuitionRates: ObjectType<string | number> = {};
      tuitionRateInfo.semesterId = this.data.semesterId;
      //tuitionRateInfo.courseCategoryId = value.courseCategoryId;

      for (const key in value) {
        if (key.startsWith('tuitionRate')) {
          tuitionRates[key] = value[key];
        } else {
          tuitionRateInfo[key] = value[key];
        }
      }

      tuitionRateInfo['tuitionRates'] = tuitionRates;
      this.apiService
        .post('tuition/save-category-tuition-rate', tuitionRateInfo)
        .pipe(take(1))
        .subscribe((data) => {
          console.log(data);
          this.actionListner.emit(true);
        });
    }
    return true;
  }
}
