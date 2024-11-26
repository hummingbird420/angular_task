import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { map } from 'rxjs/operators';
import { ConfirmDialog } from 'src/app/components/templates/confirm/confirm.dialog';
import { ListCodeInfo, SortedFieldInfo } from 'src/app/models';
import { AlertService, ApiService, ApiUrl } from 'src/app/services';
import { createBreadcrumb, Page } from '../../../page';

@Component({
  templateUrl: './course-record-template.page.html',
  styleUrls: ['./course-record-template.page.scss'],
})
export class CourseRecordTemplatePage extends Page implements OnInit {
  recordSections: ListCodeInfo[] = [];
  selectedSection: number = 0;

  formFields: Map<string, SortedFieldInfo<any, string>[]>;
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
      createBreadcrumb('Courses/Modules', '/setup/courses'),
      createBreadcrumb('Course Record Template', undefined, true),
    ];
    this.rightLinkUrl = ApiUrl.subject_record_template_right_links;

    this.formFields = new Map<string, SortedFieldInfo<any, string>[]>();
  }

  ngOnInit(): void {
    this.apiService
      .get<ListCodeInfo[]>(ApiUrl.subject_record_sections + '/template')
      .pipe(
        map((data) => {
          data.forEach((tab) => {
            const tabFields = this.apiService
              .get<SortedFieldInfo<any, string>[]>(
                ApiUrl.subject_fields + 0 + '/' + tab.listCode
              )
              .pipe(
                map((data) => {
                  this.formFields.set(tab.listCode, data);
                })
              )
              .subscribe();
          });
          return data;
        })
      )
      .toPromise()
      .then((data) => {
        this.recordSections = data;
        this.cdRef.detectChanges();
      });

    this.apiService
      .getPromise<SortedFieldInfo<any, string>[]>(
        ApiUrl.subject_standard_fields + 0
      )
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

  /******** fields ********/

  getFormFields(sectionName: string): SortedFieldInfo<any, string>[] {
    return this.formFields.get(sectionName) || [];
  }

  drop(
    event: CdkDragDrop<SortedFieldInfo<any, string>[]>,
    sectionName: string
  ) {
    moveItemInArray(
      this.formFields.get(sectionName) || [],
      event.previousIndex,
      event.currentIndex
    );
  }

  openAddStandardFieldsDialog(): void {
    let availableFields = this.standardFields;

    for (let index = 0; index < this.recordSections.length; index++) {
      const element = this.recordSections[index];
      const fields = this.formFields.get(element.listCode);
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
        const element = this.recordSections[this.selectedSection];
        const fields = this.formFields.get(element.listCode) || [];
        for (let index = 0; index < data.length; index++) {
          fields.unshift(data[index]);
        }
        this.cdRef.detectChanges();
      });*/
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
        const element = this.recordSections[this.selectedSection];
        const fields = this.formFields.get(element.listCode) || [];
        fields.splice(index, 1);
        this.cdRef.detectChanges();
      }
    });
  }
  saveChanges() {
    this.formFields.forEach((fields, sectionName, map) => {
      const sortOrder = fields.reduce((prev, next, index, arr) => {
        return prev + (index > 0 ? ',' : '') + next.sortId;
      }, '');
      console.log(sectionName + ': ' + sortOrder);
    });
  }
}
