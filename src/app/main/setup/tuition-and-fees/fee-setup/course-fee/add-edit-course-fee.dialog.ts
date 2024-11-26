import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import { FormBuilder, FormControl, ValidatorFn } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { map, take, takeUntil } from 'rxjs/operators';
import { PairValue, SortedFieldInfo } from 'src/app/models';
import { ApiService, DictionaryService } from 'src/app/services';
import { FormField } from 'src/app/util/utility-funtions';
import { AddEditFeeComponent } from '../add-edit-fee.component';

const emptyField = {} as SortedFieldInfo<any, number>;

@Component({
  selector: 'o-add-edit-course-fee',
  templateUrl: './../add-edit-fee.component.html',
  styles: [],
})
export class AddEditCourseFeeDialog
  extends AddEditFeeComponent
  implements OnInit
{
  title: string = 'Add Edit Dialog';
  addButtonLabel: string = 'Add';
  closeButtonLabel = 'Close';
  addIcon: string = 'add';
  courseIdIndex = 0;

  constructor(
    private cdRef: ChangeDetectorRef,
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    protected dictionaryService: DictionaryService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    super(dictionaryService);
    this.requiredFields = ['curriculumId', 'courseId', 'feeName', 'fee'];
    if (this.data.courseFeeId) {
      this.addButtonLabel = 'Update';
      this.addIcon = 'update';
    }
    this.apiService
      .get<SortedFieldInfo<any, number>[]>(
        this.createUrl('fee/course-fee-fields', this.data.courseFeeId)
      )
      .pipe(
        map((fields) => {
          let formControls: FormField<FormControl> = {};
          fields.forEach((field, index) => {
            formControls[field.fieldName] = new FormControl(
              field.fieldValue,
              this.getValidators(field)
            );

            this.formFields[index + field.fieldName] = field;
            if (field.fieldName === 'courseId') {
              this.courseIdIndex = index;
            }
          });
          this.formGroup = this.formBuilder.group(formControls);

          return fields;
        })
      )
      .subscribe((data) => {
        const curriculumControl = this.formGroup.controls['curriculumId'];

        if (curriculumControl) {
          curriculumControl.valueChanges
            .pipe(takeUntil(this.destroyed$))
            .subscribe((curriculumId) => {
              console.log('curriculumId' + curriculumId);
              if (curriculumId || curriculumId == 0)
                this.getCourseDropdownOptions(curriculumId);
            });
        }
        this.cdRef.detectChanges();
      });
  }

  ngOnInit(): void {}

  getCourseDropdownOptions(curriculumId: number) {
    this.apiService
      .get<PairValue<number, string>[]>(
        this.createUrl('course/dropdown-options', curriculumId)
      )
      .pipe(take(1))
      .subscribe((options) => {
        this.formFields[this.courseIdIndex + 'courseId'].options = options;
      });
  }

  getValidators(field: SortedFieldInfo<any, number>): ValidatorFn[] {
    return super.getValidators(field);
  }

  saveFee() {
    if (super.saveFee()) {
      const value = this.formGroup.value;
      value.courseFeeId = this.data.courseFeeId;
      value.semesterId = this.data.semesterId;
      value.isSeparatePayment = this.formGroup.value.isSeparatePayment
        ? '1'
        : '0';
      value.isTaxable = value.isTaxable ? '1' : '0';
      value.t1098 = value.t1098 ? '1' : '0';
      if (value.hasOwnProperty('isFa')) {
        value.isFa = value.isFa ? 1 : 0;
      }
      if (value.hasOwnProperty('isRpp')) {
        value.isRpp = value.isRpp ? 1 : 0;
      }
      if (value.hasOwnProperty('t1098')) {
        value.t1098 = value.t1098 ? 1 : 0;
      }
      console.log(value);
      this.apiService
        .post('fee/save-course-fee', value)
        .pipe(take(1))
        .subscribe((data) => {
          this.actionListner.emit(true);
        });
    }

    return true;
  }
}
