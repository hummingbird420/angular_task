import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { takeUntil } from 'rxjs/operators';
import { ApiService, DictionaryService } from 'src/app/services';
import { AddEditTuitionComponent } from '../add-edit-tuition.component';

@Component({
  selector: 'o-add-edit-program-tuition',
  templateUrl: './../add-edit-tuition.component.html',
})
export class AddEditProgramTuitionDialog
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
    this.title = 'Add Tuition Rate by Program';
    if (this.data.edit) {
      this.title = 'Edit Tuition Rate by Program';
      this.addButtonLabel = 'Update';
      this.addIcon = 'update';
    }

    this.getFormFields(
      this.formBuilder,
      this.apiService,
      'tuition/program-level-tuition-rate-fields',
      {
        semesterId: this.data.semesterId,
        levelId: this.data.levelId,
        curriculumId: this.data.curriculumId,
        programId: this.data.programId,
        programLevelId: this.data.programLevelId,
        batchNumber: this.data.batchNumber,
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
