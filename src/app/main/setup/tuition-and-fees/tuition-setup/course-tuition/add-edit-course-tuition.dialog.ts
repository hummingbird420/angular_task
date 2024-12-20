import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { takeUntil } from 'rxjs/operators';
import { ApiService, DictionaryService } from 'src/app/services';
import { AddEditTuitionComponent } from '../add-edit-tuition.component';

@Component({
  selector: 'o-add-edit-course-tuition',
  templateUrl: './../add-edit-tuition.component.html',
})
export class AddEditCourseTuitionDialog
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
    this.title = 'Add Course Tuition Rate';

    if (this.data.edit) {
      this.title = 'Edit Course Tuition Rate';
      this.addButtonLabel = 'Update';
      this.addIcon = 'update';
    }
    this.getFormFields(
      this.formBuilder,
      this.apiService,
      'tuition/course-tuition-rate-fields',
      {
        semesterId: this.data.semesterId,
        levelId: this.data.levelId,
        curriculumId: this.data.curriculumId,
        batchNumber: this.data.batchNumber,
        subjectId: this.data.subjectId,
      }
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
    }
    return true;
  }
}
