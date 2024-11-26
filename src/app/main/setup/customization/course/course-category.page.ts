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

import { CourseCategoryInfo } from 'src/app/models';
import { AlertService, ApiService, DictionaryService } from 'src/app/services';
import { DialogService } from 'src/app/services/dialog.service';
import { OrbundValidators } from 'src/app/util';
import { createBreadcrumb, Page } from '../../../page';

@Component({
  templateUrl: './course-category.page.html',
  styleUrls: ['./course-category.page.scss'],
})
export class CourseCategoryPage
  extends Page
  implements OnInit, AfterViewInit, OnDestroy
{
  courseCategories: CourseCategoryInfo[] = [];
  deletedCourseCategories: number[] = [];

  maxLengthName = 250;
  maxLengthCode = 25;
  maxLength = (length: number) => (length || 250) + 1;

  //Dialogs
  @ViewChild('addEditCategoryTemplate')
  addEditCategoryTemplate!: TemplateRef<unknown>;
  addEditCategoryTemplatePortal!: TemplatePortal<any>;
  addEditCategoryFormGroup: FormGroup;
  selectedIndex: number = -1;

  constructor(
    private viewContainerRef: ViewContainerRef,
    private cdRef: ChangeDetectorRef,
    private router: Router,
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private alertService: AlertService,
    private dialogService: DialogService,
    public dialog: MatDialog,
    public dictionaryService: DictionaryService
  ) {
    super();

    this.subTitles = [
      createBreadcrumb('Customization', '/setup/customization'),
      createBreadcrumb('Course Category', undefined, true),
    ];
    this.addEditCategoryFormGroup = this.formBuilder.group({});
  }

  ngOnInit(): void {
    this.getCourseCategories();
    this.addEditCategoryFormGroup = this.formBuilder.group({
      categoryName: new FormControl('', [
        OrbundValidators.required('Category Name', this.dictionaryService),
        OrbundValidators.maxLength(this.maxLengthName, this.dictionaryService),
      ]),
      categoryCode: new FormControl('', [
        OrbundValidators.required('Category Code', this.dictionaryService),
        OrbundValidators.maxLength(this.maxLengthCode, this.dictionaryService),
      ]),
    });
  }

  ngAfterViewInit(): void {
    this.addEditCategoryTemplatePortal = new TemplatePortal(
      this.addEditCategoryTemplate,
      this.viewContainerRef
    );
  }

  getCourseCategories() {
    this.apiService
      .getPromise<CourseCategoryInfo[]>('course-category/all')
      .then((data) => {
        this.courseCategories = data;
        this.cdRef.detectChanges();
      });
  }

  isInvalid(fieldName: string): boolean {
    const control = this.addEditCategoryFormGroup.controls[fieldName];
    return (control.dirty || control.touched) && control.invalid;
  }

  getErrorMessage(fieldName: string) {
    const control = this.addEditCategoryFormGroup.controls[fieldName];
    return control.errors!.message;
  }

  hasError() {
    this.addEditCategoryFormGroup.markAllAsTouched();
    if (this.addEditCategoryFormGroup.invalid) {
      this.alertService.showErrorAlert('Please fill in the required fields.');
      return true;
    }
    return false;
  }

  onSelectionChange(index: number) {
    this.selectedIndex = index;
  }

  addOption() {
    const options = AddEditDialog.getOptions(
      this.addEditCategoryFormGroup,
      this.addEditCategoryTemplatePortal,
      { title: 'Add Category' }
    );
    const dialogRef = this.dialog.open(AddEditDialog, options);

    dialogRef.afterOpened().subscribe((data) => {
      dialogRef.componentInstance.resetAddEditForm();
    });

    dialogRef.componentInstance.addEditEmitter
      .pipe(takeUntil(this.destroyed$))
      .subscribe(() => {
        if (this.hasError()) {
          return;
        }
        const controls = this.addEditCategoryFormGroup.controls;
        const categoryName = controls.categoryName.value;
        const categoryCode = controls.categoryCode.value;
        const duplicates = this.courseCategories.filter(
          (value) => value.categoryCode == categoryCode
        );
        if (duplicates.length > 0) {
          this.alertService.showAlert('Code should be unique.');
        } else {
          this.courseCategories.push({
            courseCategoryId: 0,
            categoryName: categoryName,
            categoryCode: categoryCode,
          });
          this.cdRef.detectChanges();
          dialogRef.updateSize('270px');
          dialogRef.componentInstance.onSuccess('Category added successfully.');
        }
      });
  }

  editOption(selectedOptions: MatListOption[]) {
    if (!this.hasSelectedOptions(selectedOptions)) {
      return;
    }

    const options = AddEditDialog.getOptions(
      this.addEditCategoryFormGroup,
      this.addEditCategoryTemplatePortal,
      { title: 'Edit Category', edit: true }
    );
    const courseCategoryId = selectedOptions[0].value.courseCategoryId;
    const categoryName = selectedOptions[0].value.categoryName;
    const categoryCode = selectedOptions[0].value.categoryCode;

    const dialogRef = this.dialog.open(AddEditDialog, options);

    dialogRef.afterOpened().subscribe((data) => {
      dialogRef.componentInstance.resetAddEditForm({
        categoryName: categoryName,
        categoryCode: categoryCode,
      });
    });

    dialogRef.componentInstance.addEditEmitter
      .pipe(takeUntil(this.destroyed$))
      .subscribe(() => {
        if (this.hasError()) {
          return;
        }
        const controls = this.addEditCategoryFormGroup.controls;
        const categoryName = controls.categoryName.value;
        const categoryCode = controls.categoryCode.value;
        const duplicates = this.courseCategories.filter(
          (value, index) =>
            value.categoryCode == categoryCode && index != this.selectedIndex
        );
        if (duplicates.length > 0) {
          this.alertService.showAlert('Code should be unique.');
        } else {
          this.courseCategories.map((value, index, courseCategories) => {
            if (index == this.selectedIndex) {
              courseCategories[index] = {
                courseCategoryId: courseCategoryId,
                categoryName: categoryName,
                categoryCode: categoryCode,
              };
            }
          });
          this.alertService.showSuccessAlert('Category updated successfully.');
          this.cdRef.detectChanges();
          dialogRef.close();
        }
      });
  }

  removeOption(selectedOptions: MatListOption[]) {
    if (!this.hasSelectedOptions(selectedOptions)) {
      return;
    }

    this.dialogService.confirmDelete(() => {
      selectedOptions.map((option: MatListOption) => {
        const courseCategoryId = option.value.courseCategoryId;

        this.courseCategories.filter((value, index, courseCategories) => {
          if (value.categoryCode == option.value.categoryCode) {
            courseCategories.splice(index, 1);
            if (courseCategoryId > 0) {
              this.deletedCourseCategories.push(courseCategoryId);
            }
            this.cdRef.detectChanges();
            this.alertService.showSuccessAlert(
              'Category removed successfully.'
            );
          }
        });
      });
    });
  }

  saveCourseCategory() {
    this.apiService
      .post<any>('course-category/delete', this.deletedCourseCategories)
      .pipe(
        mergeMap((deleteResponse) =>
          this.apiService
            .post<any>('course-category/save', this.courseCategories)
            .pipe(
              map((saveResponse) => {
                return {
                  deleteResponse: deleteResponse,
                  saveResponse: saveResponse,
                };
              })
            )
        )
      )
      .pipe(take(1))
      .subscribe((data) => {
        this.getCourseCategories();
        this.alertService.showSuccessAlert(
          'Course categories saved successfully.'
        );
      });
  }

  hasSelectedOptions(selectedOptions: MatListOption[]): boolean {
    if (selectedOptions.length == 0) {
      this.alertService.showAlert('Please select an option');
      return false;
    }
    return true;
  }

  ngOnDestroy(): void {
    this.destroyed();
  }

  back() {
    this.router.navigate(['setup/customization']);
  }
}
