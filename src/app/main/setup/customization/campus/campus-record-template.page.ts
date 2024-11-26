import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ListCodeInfo, SortedFieldInfo } from 'src/app/models';
import { createBreadcrumb, Page } from '../../../page';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  AlertService,
  ApiService,
  ApiUrl,
  DictionaryService,
} from 'src/app/services';
import { map } from 'rxjs/operators';
import { ConfirmDialog } from 'src/app/components/templates/confirm/confirm.dialog';

@Component({
  templateUrl: './campus-record-template.page.html',
  styleUrls: ['./campus-record-template.page.scss'],
})
export class CampusRecordTemplatePage extends Page implements OnInit {
  campusRecordSections: ListCodeInfo[] = [];
  selectedSection: number = 0;

  campusFormFields: Map<string, SortedFieldInfo<any, string>[]>;
  standardFields: SortedFieldInfo<any, string>[] = [];

  constructor(
    private apiService: ApiService,
    public dialog: MatDialog,
    private cdRef: ChangeDetectorRef,
    private alertService: AlertService
  ) {
    super();
    this.subTitles = [
      createBreadcrumb('Customization', '/setup/customization'),
      createBreadcrumb('Campuses', '/setup/customization/campuses'),
      createBreadcrumb('Campus Record Template', undefined, true),
    ];
    this.campusFormFields = new Map<string, SortedFieldInfo<any, string>[]>();
  }

  ngOnInit(): void {
    this.apiService
      .get<ListCodeInfo[]>(ApiUrl.campus_record_sections + '/template')
      .pipe(
        map((data) => {
          data.forEach((tab) => {
            const tabFields = this.apiService
              .get<SortedFieldInfo<any, string>[]>(
                ApiUrl.campus_fields + 0 + '/' + tab.listCode
              )
              .pipe(
                map((data) => {
                  this.campusFormFields.set(tab.listCode, data);
                })
              )
              .subscribe();
          });
          return data;
        })
      )
      .toPromise()
      .then((data) => {
        this.campusRecordSections = data;
        this.cdRef.detectChanges();
      });

    this.apiService
      .getPromise<SortedFieldInfo<any, string>[]>(ApiUrl.campus_standard_fields)
      .then((data) => (this.standardFields = data));
  }

  setSelectedSection(index: number) {
    this.selectedSection = index;
  }

  isEditable(listCode: string): boolean {
    if (listCode) {
      return listCode.startsWith('recordSection');
    }

    return false;
  }

  openAddTab() {
    const options = {
      width: '250px',
      disableClose: true,
      data: {
        listText: '',
        listCode: 'recordSection',
      },
    };
    const dialogRef = this.dialog.open(AddEditTabDialog, options);
    dialogRef.beforeClosed().subscribe((data: ListCodeInfo) => {
      if (data) this.addTab(data, this.selectedSection);
    });
  }
  addTab(listCodeInfo: ListCodeInfo, index: number) {
    this.campusRecordSections.splice(index + 1, 0, listCodeInfo);
    this.setSelectedSection(index + 1);
    this.cdRef.detectChanges();
  }
  openEditTab() {
    const options = {
      width: '250px',
      disableClose: true,
      data: {
        listText: '',
      },
    };
    const dialogRef = this.dialog.open(AddEditTabDialog, options);
    dialogRef.beforeClosed().subscribe((data: ListCodeInfo) => {
      if (data) this.addTab(data, this.selectedSection);
    });
  }

  removeTab(index: number) {
    this.campusRecordSections.splice(index, 1);
  }

  /******** fields ********/

  getFormFields(sectionName: string): SortedFieldInfo<any, string>[] {
    return this.campusFormFields.get(sectionName) || [];
  }

  drop(
    event: CdkDragDrop<SortedFieldInfo<any, string>[]>,
    sectionName: string
  ) {
    moveItemInArray(
      this.campusFormFields.get(sectionName) || [],
      event.previousIndex,
      event.currentIndex
    );
  }

  openAddStandardFieldsDialog(): void {
    let availableFields = this.standardFields;

    for (let index = 0; index < this.campusRecordSections.length; index++) {
      const element = this.campusRecordSections[index];
      const fields = this.campusFormFields.get(element.listCode);
      if (fields) {
        for (let i = 0; i < fields.length; i++) {
          const field = fields[i];
          availableFields = availableFields.filter(
            (value) => value.sortId !== field.sortId
          );
        }
      }
    }

    if (!availableFields.length) {
      this.alertService.showAlert('No standard field available.');
      return;
    }
    const options = {
      disableClose: true,
      data: availableFields,
    };
    /*
    const dialogRef = this.dialog.open(AddStandardFieldDialog, options);
    dialogRef
      .beforeClosed()
      .subscribe((data: SortedFieldInfo<any, string>[]) => {
        if (!data) {
          return;
        }
        const element = this.campusRecordSections[this.selectedSection];
        const fields = this.campusFormFields.get(element.listCode) || [];
        for (let index = 0; index < data.length; index++) {
          fields.unshift(data[index]);
        }
        this.cdRef.detectChanges();
      });
      */
  }

  editField(index: number) {
    console.log(index);

    const options = {
      disableClose: true,
      data: this.campusRecordSections,
    };

    const dialogRef = this.dialog.open(EditStandardFieldDialog, options);
    dialogRef.beforeClosed().subscribe((data) => {
      if (data) {
        const element = this.campusRecordSections[this.selectedSection];
        const fields = this.campusFormFields.get(element.listCode) || [];
        const field = fields.splice(index, 1);
        const selectedTabFields = this.campusFormFields.get(data) || [];
        selectedTabFields.unshift(field[0]);
        this.cdRef.detectChanges();
      }
    });
  }

  removeField(index: number) {
    const options = {
      disableClose: true,
      data: 'Are you sure you wish to remove this field?',
    };
    const dialogRef = this.dialog.open(ConfirmDialog, options);
    dialogRef.beforeClosed().subscribe((yes) => {
      if (yes) {
        console.log(index);
        const element = this.campusRecordSections[this.selectedSection];
        const fields = this.campusFormFields.get(element.listCode) || [];
        fields.splice(index, 1);
        this.cdRef.detectChanges();
      }
    });
  }

  saveChanges() {
    this.campusFormFields.forEach((fields, sectionName, map) => {
      const sortOrder = fields.reduce((prev, next, index, arr) => {
        return prev + (index > 0 ? ',' : '') + next.sortId;
      }, '');
      console.log(sectionName + ': ' + sortOrder);
    });
  }
} //end of main class

/***************Dialogs *********/

@Component({
  templateUrl: './add-edit-tab.dialog.html',
})
export class AddEditTabDialog {
  formGroup: FormGroup;
  dialogTitle: string = 'Add Tab';
  tabNameLabel: string = 'Title';
  addButtonLabel: string = 'Add';
  closeButtonLabel: string = 'Close';

  constructor(
    private formBuilder: FormBuilder,
    public dictionaryService: DictionaryService,
    public dialogRef: MatDialogRef<AddEditTabDialog>,
    @Inject(MAT_DIALOG_DATA) public listCodeInfo: ListCodeInfo
  ) {
    if (listCodeInfo.listText.length > 0) {
      this.dialogTitle = 'Edit Tab';
      this.tabNameLabel = 'Update';
    }

    this.dictionaryService
      .getTranslatedWord(this.dialogTitle)
      .toPromise()
      .then((data) => (this.dialogTitle = data));

    this.dictionaryService
      .getTranslatedWord(this.tabNameLabel)
      .toPromise()
      .then((data) => (this.tabNameLabel = data));

    this.dictionaryService
      .getTranslatedWord(this.addButtonLabel)
      .toPromise()
      .then((data) => (this.addButtonLabel = data));

    this.dictionaryService
      .getTranslatedWord(this.closeButtonLabel)
      .toPromise()
      .then((data) => (this.closeButtonLabel = data));

    this.formGroup = this.formBuilder.group({
      tabName: new FormControl(listCodeInfo.listText, [Validators.required]),
    });
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  addTab() {
    if (this.formGroup.valid) {
      this.listCodeInfo.listText = this.formGroup.controls.tabName.value;
      this.dialogRef.close(this.listCodeInfo);
    }
  }
}

/********Add standard field dialog ************/

/*************** Edit Standard Field ***************/
@Component({
  templateUrl: './edit-standard-field.dialog.html',
})
export class EditStandardFieldDialog {
  dialogTitle: string = 'Edit Standard Field';
  addButtonLabel: string = 'Update';
  closeButtonLabel: string = 'Close';

  fieldTitle: string = 'Select Tab';
  formGroup: FormGroup;

  constructor(
    private dictionaryService: DictionaryService,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<EditStandardFieldDialog>,
    @Inject(MAT_DIALOG_DATA) public fields: ListCodeInfo[]
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

    this.dictionaryService
      .getTranslatedWord(this.fieldTitle)
      .toPromise()
      .then((data) => (this.fieldTitle = data));

    this.formGroup = this.formBuilder.group({
      tab: new FormControl('', [Validators.required]),
    });
  }

  getErrorMessage() {
    if (this.formGroup.invalid) {
      return 'Please select a tab.';
    }
    return '';
  }

  editField() {
    if (this.formGroup.valid) {
      const value = this.formGroup.controls.tab.value;
      this.dialogRef.close(value);
    }
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
