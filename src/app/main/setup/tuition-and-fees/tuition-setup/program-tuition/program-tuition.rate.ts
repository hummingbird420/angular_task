import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { take } from 'rxjs/operators';
import { ProgramLevelTuitionRateInfo } from 'src/app/models/tuition-rate.info';
import { AlertService, ApiService, DictionaryService } from 'src/app/services';
import { DialogService } from 'src/app/services/dialog.service';
import { TuitionComponent } from '../tuition.component';
import { AddEditProgramTuitionDialog } from './add-edit-program-tuition.dialog';

@Component({
  selector: 'o-program-tuition',
  templateUrl: './../tuition.component.html',
})
export class ProgramTuitionRate
  extends TuitionComponent<any>
  implements OnInit
{
  constructor(
    protected apiService: ApiService,
    private dialog: MatDialog,
    private dictionaryService: DictionaryService,
    private dialogService: DialogService,
    private alertService: AlertService
  ) {
    super(apiService);
    this.addButtonTooltip = this.dictionaryService.getTranslationOrWord(
      'New Tuition Rate by Program'
    );

    this.getColumns('program-tuition-datatable-columns');
  }

  ngOnInit(): void {}
  openAddEditDialog(info: ProgramLevelTuitionRateInfo, edit?: boolean) {
    const options = DialogService.getOptions();
    options.data = {
      semesterId: info.semesterId,
      levelId: info.levelId,
      curriculumId: info.curriculumId,
      programId: info.programId,
      programLevelId: info.programLevelId,
      batchNumber: info.batchNumber,
      edit: edit,
    };

    const dialogRef = this.dialog.open(AddEditProgramTuitionDialog, options);
    dialogRef.componentInstance.getActionListner().subscribe((data) => {
      this.getTuitions('program-level-tuition-rates');
      dialogRef.close();
    });
  }
  deleteFee(tuitionRateId: number) {
    this.dialogService.confirmDelete(() => {
      this.apiService
        .get(
          this.createUrl('tuition/delete-lesson-tuition-rate', tuitionRateId)
        )
        .pipe(take(1))
        .subscribe((data) => {
          this.getTuitions('lesson-tuition-rates');
          this.alertService.showSuccessAlert(
            'Lesson tuition rate deleted successfully.'
          );
        });
    });
  }

  createNew() {
    this.openAddEditDialog({
      semesterId: this.selectedSemesterId,
      levelId: 0,
      curriculumId: -1,
      programId: 0,
      programLevelId: 0,
      batchNumber: '',
    } as ProgramLevelTuitionRateInfo);
  }
}
