import { TemplatePortal } from '@angular/cdk/portal';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatListOption } from '@angular/material/list';
import { Router } from '@angular/router';
import { first, map, switchMap, take, takeUntil } from 'rxjs/operators';
import { AddEditDialog } from 'src/app/components/templates/dialogs/add-edit.dialog';
import { SortedFieldInfo } from 'src/app/models';
import { StudentBatchInfo } from 'src/app/models/student-batch.info';
import { AlertService, ApiService, DictionaryService } from 'src/app/services';
import { DialogService } from 'src/app/services/dialog.service';
import { OrbundValidators } from 'src/app/util';
import { createBreadcrumb, Page } from '../../../page';

@Component({
  templateUrl: './student-batch.page.html',
  styleUrls: ['./student-batch.page.scss'],
})
export class StudentBatchPage
  extends Page
  implements OnInit, OnDestroy, AfterViewInit
{
  label: string = this.dictionaryService.getTranslationOrWord(
    'Student Batch Numbers'
  );
  selectedIndex: number = -1;
  maxValue = Number.MAX_SAFE_INTEGER;
  batches: StudentBatchInfo[] = [];
  fields: SortedFieldInfo<any, any>[] = [];
  deletedBatchIds: number[] = [];
  //Dialog
  @ViewChild('addEditTemplate') addEditTemplate!: TemplateRef<unknown>;
  addEditTemplatePortal!: TemplatePortal<any>;
  addEditFormGroup: FormGroup;

  constructor(
    public dialog: MatDialog,
    private cdRef: ChangeDetectorRef,
    private router: Router,
    private alertService: AlertService,
    private dictionaryService: DictionaryService,
    private formBuilder: FormBuilder,
    private viewContainerRef: ViewContainerRef,
    private dialogService: DialogService,
    private apiService: ApiService
  ) {
    super();
    //this.subTitles = ['Customization', 'Student Batches'];
    this.subTitles = [
      createBreadcrumb('Customization', '/setup/customization'),
      createBreadcrumb('Student Batches', undefined, true),
    ];
    this.addEditFormGroup = this.formBuilder.group({});
    this.apiService
      .get<SortedFieldInfo<any, any>[]>('student-batch/fields/0')
      .pipe(
        map((fields) => {
          const controls: { [key: string]: FormControl } = {};
          controls['studentBatchId'] = new FormControl(0);
          fields.forEach((field) => {
            controls[field.fieldName] = new FormControl(field.fieldValue, [
              OrbundValidators.required(
                field.fieldTitle,
                this.dictionaryService
              ),
              OrbundValidators.maxLength(250, this.dictionaryService),
            ]);
          });
          this.fields = fields;
          this.addEditFormGroup = this.formBuilder.group(controls);
        }),
        takeUntil(this.destroyed$)
      )
      .subscribe(() => {
        this.cdRef.detectChanges();
      });
  }
  ngOnDestroy(): void {
    this.destroyed();
  }
  ngAfterViewInit(): void {
    this.addEditTemplatePortal = new TemplatePortal(
      this.addEditTemplate,
      this.viewContainerRef
    );
  }

  ngOnInit(): void {
    this.apiService
      .get<StudentBatchInfo[]>('student-batch/all')
      .pipe(takeUntil(this.destroyed$))
      .subscribe((batches) => {
        this.batches = batches;
        this.cdRef.detectChanges();
      });
  }
  onSelectionChange(index: number) {
    this.selectedIndex = index;
  }
  addOption() {
    const options = AddEditDialog.getOptions(
      this.addEditFormGroup,
      this.addEditTemplatePortal
    );
    const initValues = {
      studentBatcheId: 0,
      batchNumber: '',
    };
    const dialogRef = this.dialog.open(AddEditDialog, options);
    dialogRef.afterOpened().subscribe((data) => {
      dialogRef.componentInstance.resetAddEditForm(initValues);
    });
    dialogRef.componentInstance.addEditEmitter
      .pipe(takeUntil(this.destroyed$))
      .subscribe((result) => {
        if (dialogRef.componentInstance.hasError()) {
          return;
        }
        const values = this.addEditFormGroup.value;
        const duplicates = this.batches.filter(
          (value) => value.batchNumber == values.batchNumber
        );
        if (duplicates.length > 0) {
          this.alertService.showErrorAlert('Batch Number should be unique.');
        } else {
          this.batches.push(values);
          this.cdRef.detectChanges();
          dialogRef.componentInstance.onSuccess(
            'Batch Number added successfully.'
          );
          dialogRef.componentInstance.resetAddEditForm(initValues);
        }
      });
  }

  editOption(selectedOptions: MatListOption[]) {
    if (this.hasSelectedOptions(selectedOptions)) {
      const options = AddEditDialog.getOptions(
        this.addEditFormGroup,
        this.addEditTemplatePortal,
        { edit: true }
      );
      const dialogRef = this.dialog.open(AddEditDialog, options);
      dialogRef.afterOpened().subscribe((data) => {
        const values = {
          studentBatcheId: selectedOptions[0].value.studentBatcheId,
          batchNumber: selectedOptions[0].value.batchNumber,
        };
        dialogRef.componentInstance.resetAddEditForm(values);
        dialogRef.componentInstance.addEditEmitter
          .pipe(takeUntil(this.destroyed$))
          .subscribe(() => {
            if (dialogRef.componentInstance.hasError()) {
              return;
            }
            const updatedbatch = this.addEditFormGroup.value;

            const duplicates = this.batches.filter(
              (value, index) =>
                value.batchNumber == updatedbatch.batchNumber &&
                index != this.selectedIndex
            );
            if (duplicates.length > 0) {
              this.alertService.showErrorAlert(
                'Batch Number should be unique.'
              );
            } else {
              this.batches.map((value, index, batches) => {
                if (index == this.selectedIndex) {
                  batches[index] = updatedbatch;
                }
              });
              this.alertService.showSuccessAlert(
                'Batch Number updated successfully.'
              );
              this.cdRef.detectChanges();
              dialogRef.close();
            }
          });
        //
      });
      //
    }
  }
  isInvalid(fieldName: string) {
    return OrbundValidators.isInvalid(this.addEditFormGroup, fieldName);
  }
  getErrorMessage(fieldName: string): string | null {
    if (this.addEditFormGroup.controls[fieldName].errors) {
      return this.addEditFormGroup.controls[fieldName].errors!.message;
    }
    return null;
  }
  private hasSelectedOptions(selectedOptions: MatListOption[]): boolean {
    if (selectedOptions.length == 0) {
      this.alertService.showAlert('Please select a batch number');
      return false;
    }
    return true;
  }

  removeOption(selectedOptions: MatListOption[]) {
    if (this.hasSelectedOptions(selectedOptions)) {
      this.dialogService.confirmDelete(() => {
        const deletedBatches = this.batches.splice(this.selectedIndex, 1);
        deletedBatches.map((batchInfo) =>
          this.deletedBatchIds.push(batchInfo.studentBatcheId)
        );
        this.cdRef.detectChanges();
      });
    }
  }

  saveBatches() {
    this.apiService
      .post('student-batch/delete', this.deletedBatchIds)
      .pipe(take(1))
      .pipe(
        switchMap((deleteResponse) => {
          return this.apiService
            .post<any>('student-batch/save', this.batches)
            .pipe(take(1));
        })
      )

      .subscribe((data) => {
        this.batches = data.savedStudentBatches;
        this.alertService.showSuccessAlert(
          'Batch Numbers are saved successfully.'
        );
      });
  }

  back() {
    this.router.navigate(['/setup/customization']);
  }
}
