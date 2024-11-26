import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SortedFieldInfo } from 'src/app/models';
import { AlertService, DictionaryService } from 'src/app/services';
import { OrbundValidators } from 'src/app/util';
import { FormField } from 'src/app/util/utility-funtions';

@Component({
  templateUrl: './add-standard-field.dialog.html',
  styleUrls: ['./add-standard-field.dialog.scss'],
})
export class AddStandardFieldDialog {
  dialogTitle: string = 'Standard Field List';
  addButtonLabel: string = 'Add';
  closeButtonLabel: string = 'Close';
  formGroup: FormGroup;

  displayedColumns: string[] = ['standardField'];
  fieldMap: Map<string, SortedFieldInfo<any, string>>;

  constructor(
    private formBuilder: FormBuilder,
    public dictionaryService: DictionaryService,
    private alertService: AlertService,
    public dialogRef: MatDialogRef<AddStandardFieldDialog>,
    @Inject(MAT_DIALOG_DATA) public fields: SortedFieldInfo<any, string>[]
  ) {
    this.dictionaryService
      .getTranslatedWord(this.dialogTitle)
      .toPromise()
      .then((data) => (this.dialogTitle = data));

    this.dictionaryService
      .getTranslatedWord(this.addButtonLabel)
      .toPromise()
      .then((data) => (this.addButtonLabel = data));

    this.dictionaryService
      .getTranslatedWord(this.closeButtonLabel)
      .toPromise()
      .then((data) => (this.closeButtonLabel = data));

    this.fieldMap = new Map<string, SortedFieldInfo<any, string>>();
    let formControls: FormField<FormControl> = {};
    for (let i = 0; i < fields.length; i++) {
      formControls[fields[i].fieldName] = new FormControl(false);
      this.fieldMap.set(fields[i].fieldName, fields[i]);
    }
    this.formGroup = this.formBuilder.group(formControls, {
      validators: [OrbundValidators.atLeastOneValue],
    });
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  addFields() {
    if (this.formGroup.valid) {
      const selectedFields = [];
      const value = this.formGroup.value;
      for (let fieldName in value) {
        if (value[fieldName]) {
          const field = this.fieldMap.get(fieldName);
          if (field) selectedFields.push(field);
        }
      }
      this.dialogRef.close(selectedFields);
    } else {
      this.alertService.showErrorAlert(this.formGroup.errors?.message);
    }
  }
}
