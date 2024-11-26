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
import { map, mergeMap, take, takeUntil } from 'rxjs/operators';
import { AddEditDialog } from 'src/app/components/templates/dialogs/add-edit.dialog';
import { createBreadcrumb, Page } from 'src/app/main/page';
import { SortedFieldInfo } from 'src/app/models';
import { TuitionRateTypeInfo } from 'src/app/models/tuition-rate-type.info';
import { AlertService, ApiService, DictionaryService } from 'src/app/services';
import { DialogService } from 'src/app/services/dialog.service';
import { getCommonValidators, OrbundValidators } from 'src/app/util';

@Component({
  templateUrl: './tuition-rate-type.page.html',
  styleUrls: ['./tuition-rate-type.page.scss'],
})
export class TuitionRateTypePage
  extends Page
  implements OnInit, OnDestroy, AfterViewInit
{
  tuitionRateTypes: TuitionRateTypeInfo[] = [];
  deletedTuitionRateTypeIds: number[] = [];
  fields: SortedFieldInfo<any, any>[] = [];
  selectedIndex: number = -1;
  maxValue = Number.MAX_SAFE_INTEGER;
  //Dialog
  @ViewChild('addEditTemplate') addEditTemplate!: TemplateRef<unknown>;
  addEditTemplatePortal!: TemplatePortal<any>;
  addEditFormGroup: FormGroup;
  label: string = this.dictionaryService.getTranslationOrWord('Rate Types');
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
    this.subTitles = [
      createBreadcrumb('Customization', '/setup/customization'),
      createBreadcrumb('Tuition Rate Types', undefined, true),
    ];
    this.addEditFormGroup = this.formBuilder.group({
      tuitionRateTypeId: new FormControl(0),
      rateName: new FormControl('', [
        OrbundValidators.required('Rate Type', this.dictionaryService),
        OrbundValidators.maxLength(250, this.dictionaryService),
      ]),
    });

    this.apiService
      .get<SortedFieldInfo<any, any>[]>('tuition-rate-type-fields/0')
      .pipe(
        map((fields) => {
          const controls: { [key: string]: FormControl } = {};
          controls['tuitionRateTypeId'] = new FormControl(0);
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
      .get<TuitionRateTypeInfo[]>('tuition-rate-types')
      .pipe(takeUntil(this.destroyed$))
      .subscribe((tuitionRateTypes) => {
        this.tuitionRateTypes = tuitionRateTypes;
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
      tuitionRateTypeId: 0,
      rateName: '',
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
        const duplicates = this.tuitionRateTypes.filter(
          (value) => value.rateName == values.rateName
        );
        if (duplicates.length > 0) {
          this.alertService.showErrorAlert('Rate Type should be unique.');
        } else {
          this.tuitionRateTypes.push(values);
          this.cdRef.detectChanges();
          dialogRef.componentInstance.onSuccess(
            'Rate Type added successfully.'
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
          tuitionRateTypeId: selectedOptions[0].value.tuitionRateTypeId,
          rateName: selectedOptions[0].value.rateName,
        };
        dialogRef.componentInstance.resetAddEditForm(values);
        dialogRef.componentInstance.addEditEmitter
          .pipe(takeUntil(this.destroyed$))
          .subscribe(() => {
            if (dialogRef.componentInstance.hasError()) {
              return;
            }
            const updatedbatch = this.addEditFormGroup.value;

            const duplicates = this.tuitionRateTypes.filter(
              (value, index) =>
                value.rateName == updatedbatch.rateName &&
                index != this.selectedIndex
            );
            if (duplicates.length > 0) {
              this.alertService.showErrorAlert('Rate Type should be unique.');
            } else {
              this.tuitionRateTypes.map((value, index, batches) => {
                if (index == this.selectedIndex) {
                  batches[index] = updatedbatch;
                }
              });
              this.alertService.showSuccessAlert(
                'Rate Type updated successfully.'
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
      this.alertService.showAlert('Please select a rate type');
      return false;
    }
    return true;
  }

  removeOption(selectedOptions: MatListOption[]) {
    if (this.hasSelectedOptions(selectedOptions)) {
      this.dialogService.confirmDelete(() => {
        const removedRateTypes = this.tuitionRateTypes.splice(
          this.selectedIndex,
          1
        );
        for (let i = 0; i < removedRateTypes.length; i++) {
          this.deletedTuitionRateTypeIds.push(
            removedRateTypes[i].tuitionRateTypeId
          );
        }

        this.cdRef.detectChanges();
        this.alertService.showSuccessAlert('Rate Type removed successfully.');
      });
    }
  }

  saveBatches() {
    this.apiService
      .post<any>('save-tuition-rate-types', this.tuitionRateTypes)
      .pipe(
        mergeMap((savedResponse) => {
          return this.apiService
            .post<any>(
              'delete-tuition-rate-types',
              this.deletedTuitionRateTypeIds
            )
            .pipe(
              map((deletedResponse) => {
                return {
                  savedTuitionRateTypes: savedResponse.savedTuitionRateTypes,
                  invalidTuitionRateTypes:
                    savedResponse.invalidTuitionRateTypes,
                  deletedTuitionRateTypeIds:
                    deletedResponse.deletedTuitionRateTypeIds,
                  invalidTuitionRateTypeIds:
                    deletedResponse.invalidTuitionRateTypeIds,
                };
              })
            );
        }),
        take(1)
      )
      .subscribe((data) => {
        this.tuitionRateTypes = data.savedTuitionRateTypes;
        this.alertService.showSuccessAlert(
          'Tuition rate types are saved successfully.'
        );
      });
  }

  back() {
    this.router.navigate(['/setup/customization']);
  }
}
