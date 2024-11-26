import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AlertService, ApiService, DictionaryService } from 'src/app/services';
import { DialogService } from 'src/app/services/dialog.service';
import { TuitionComponent } from '../tuition.component';

@Component({
  selector: 'o-program-credit-hour-tuition',
  templateUrl: './../tuition.component.html',
})
export class ProgramCreditHourTuitionRate
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
      'New Tuition Rate per Lesson'
    );

    this.getColumns('program-credit-hour-tuition-datatable-columns');
  }

  ngOnInit(): void {
    this.getTuitions('program-level-tuition-rates');
  }
}
