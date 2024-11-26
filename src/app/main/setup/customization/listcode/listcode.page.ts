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
  ViewEncapsulation,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

import { MatDialog } from '@angular/material/dialog';

import { MatListOption } from '@angular/material/list';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AddEditDialog } from 'src/app/components/templates/dialogs/add-edit.dialog';
import { ListCodeInfo, ListTypeInfo } from 'src/app/models';
import {
  AlertService,
  DictionaryService,
  ListcodeService,
} from 'src/app/services';
import { DialogService } from 'src/app/services/dialog.service';
import { OrbundValidators } from 'src/app/util';
import { createBreadcrumb, Page } from '../../../page';

@Component({
  templateUrl: './listcode.page.html',
  styleUrls: ['./listcode.page.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ListcodePage
  extends Page
  implements OnInit, AfterViewInit, OnDestroy
{
  destroyed$: Subject<void> = new Subject<void>();
  listTypeId: number = 0;
  listCodes: ListCodeInfo[] = [];
  listTypeInfo: ListTypeInfo;
  numericListCodes: number[] = [
    1, 2, 3, 4, 13, 16, 18, 21, 22, 23, 24, 25, 26, 27, 32, 33, 36, 39, 46, 56,
    59, 61, 65, 68, 73, 74,
  ];
  numeric: boolean = this.numericListCodes.includes(this.listTypeId);
  maxValue = Number.MAX_SAFE_INTEGER;
  //Dialogs
  @ViewChild('addEditListCodeTemplate')
  addEditListCodeTemplate!: TemplateRef<unknown>;
  addEditListCodeTemplatePortal!: TemplatePortal<any>;
  addEditListCodeFormGroup: FormGroup;
  selectedIndex: number = -1;

  constructor(
    private viewContainerRef: ViewContainerRef,
    private cdRef: ChangeDetectorRef,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    private listCodeService: ListcodeService,
    private alertService: AlertService,
    private dialogService: DialogService,
    public dictionaryService: DictionaryService
  ) {
    super();
    this.route.paramMap.subscribe((param) => {
      this.listTypeId = parseInt(param.get('id') || '0');
      const listTypeText = listCodeService.geLlistText(this.listTypeId);

      if (listTypeText) {
        this.subTitles = [
          createBreadcrumb('Customization', '/setup/customization'),
          createBreadcrumb(listTypeText, undefined, true),
        ];
      }
    });
    this.listTypeInfo = {
      listTypeId: this.listTypeId,
      listTypeText: '',
      numeric: false,
      textLabel: 'Display Text',
      codeLabel: 'Code',
    };
    this.addEditListCodeFormGroup = this.formBuilder.group({
      listText: new FormControl('', [Validators.required]),
      listCode: new FormControl('', [Validators.required]),
    });
  }
  ngAfterViewInit(): void {
    this.addEditListCodeTemplatePortal = new TemplatePortal(
      this.addEditListCodeTemplate,
      this.viewContainerRef
    );
  }
  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  ngOnInit(): void {
    console.log(this.maxValue);

    this.listCodeService.getListType(this.listTypeId).then((data) => {
      this.listTypeInfo = data;
      if (!this.subTitles.length) {
        this.subTitles = [
          createBreadcrumb('Customization', '/setup/customization'),
          createBreadcrumb(data.listTypeText, undefined, true),
        ];
      }
      const codeValidators = [
        OrbundValidators.required(
          this.listTypeInfo.codeLabel,
          this.dictionaryService
        ),
      ];
      if (this.numericListCodes.includes(this.listTypeId)) {
        this.numeric = true;
        codeValidators.push(
          OrbundValidators.maxValue(999999999, this.dictionaryService),
          OrbundValidators.positiveNumeric(
            this.listTypeInfo.textLabel,
            this.dictionaryService
          )
        );
      } else {
        codeValidators.push(
          OrbundValidators.maxLength(250, this.dictionaryService)
        );
      }
      this.addEditListCodeFormGroup = this.formBuilder.group({
        listText: new FormControl('', [
          OrbundValidators.required(
            this.listTypeInfo.textLabel,
            this.dictionaryService
          ),
          OrbundValidators.maxLength(250, this.dictionaryService),
        ]),
        listCode: new FormControl('', codeValidators),
      });
    });
    this.getListCodes();
  }

  getListCodes() {
    this.listCodeService
      .getListCodes(this.listTypeId)
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data) => {
        this.listCodes = data;
        this.cdRef.detectChanges();
      });
  }

  isInvalid(fieldName: string) {
    return OrbundValidators.isInvalid(this.addEditListCodeFormGroup, fieldName);
  }
  getErrorMessage(fieldName: string): string | null {
    if (this.addEditListCodeFormGroup.controls[fieldName].errors) {
      return this.addEditListCodeFormGroup.controls[fieldName].errors!.message;
    }
    return null;
  }
  hasError() {
    this.addEditListCodeFormGroup.markAllAsTouched();
    this.addEditListCodeFormGroup.updateValueAndValidity();
    if (this.addEditListCodeFormGroup.invalid) {
      return true;
    }
    return false;
  }
  onSelectionChange(index: number) {
    this.selectedIndex = index;
  }
  addItem() {
    const options = AddEditDialog.getOptions(
      this.addEditListCodeFormGroup,
      this.addEditListCodeTemplatePortal,
      { width: '250px' }
    );
    const dialogRef = this.dialog.open(AddEditDialog, options);
    dialogRef.afterOpened().subscribe((data) => {
      dialogRef.componentInstance.resetAddEditForm();
    });
    dialogRef.componentInstance.addEditEmitter
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data) => {
        if (this.hasError()) {
          return;
        }
        const controls = this.addEditListCodeFormGroup.controls;
        const listText = controls.listText.value;
        const listCode = controls.listCode.value;
        const duplicates = this.listCodes.filter(
          (listCodeInfo) => listCodeInfo.listCode === listCode
        );
        if (duplicates.length > 0) {
          this.alertService.showErrorAlert(
            this.listTypeInfo.codeLabel + ' should be unique.'
          );
        } else {
          this.listCodes.push({
            listCodeId: 0,
            listType: this.listTypeId,
            listCode: listCode,
            listText: listText,
          });
          this.cdRef.detectChanges();
          dialogRef.componentInstance.onSuccess('Option added successfully.');
        }
      });
  }

  editItems(selectedOptions: MatListOption[]) {
    if (selectedOptions.length == 0) {
      this.alertService.showAlert('Please select an option.');
      return;
    }
    const selectedListCodeInfo = selectedOptions[0].value;

    const options = AddEditDialog.getOptions(
      this.addEditListCodeFormGroup,
      this.addEditListCodeTemplatePortal,
      { edit: true }
    );
    const dialogRef = this.dialog.open(AddEditDialog, options);
    dialogRef.afterOpened().subscribe((data) => {
      dialogRef.componentInstance.resetAddEditForm({
        listText: selectedListCodeInfo.listText,
        listCode: selectedListCodeInfo.listCode,
      } as ListCodeInfo);
    });
    dialogRef.componentInstance.addEditEmitter
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data) => {
        if (this.hasError()) {
          return;
        }
        const controls = this.addEditListCodeFormGroup.controls;
        const listText = controls.listText.value;
        const listCode = controls.listCode.value;
        const duplicates = this.listCodes.filter(
          (listCodeInfo, index) =>
            listCodeInfo.listCode === listCode && index != this.selectedIndex
        );
        if (duplicates.length > 0) {
          this.alertService.showErrorAlert(
            this.listTypeInfo.codeLabel + ' should be unique.'
          );
          return;
        }
        selectedListCodeInfo.listCode = listCode;
        selectedListCodeInfo.listText = listText;
        this.listCodes.map((value, index, listCodes) => {
          if (index == this.selectedIndex) {
            listCodes[index] = selectedListCodeInfo;
          }
        });
        this.alertService.showSuccessAlert('Option updated successfully.');
        this.cdRef.detectChanges();
        dialogRef.close();
      });
  }

  removeItems(selectedOptions: MatListOption[]) {
    if (selectedOptions.length == 0) {
      this.alertService.showAlert('Please select an option.');
      return;
    }
    this.dialogService.confirmDelete(() => {
      this.listCodes.splice(this.selectedIndex, 1);
      this.cdRef.detectChanges();
      this.alertService.showSuccessAlert('Option removed successfully.');
    });
  }

  saveListCodes() {
    this.listCodeService
      .saveListCodes(this.listCodes, this.listTypeId)
      .subscribe((data) => {
        if (data.success) {
          this.getListCodes();
          this.alertService.showSuccessAlert('Data saved successfully.');
        }
      });
  }
  back() {
    this.router.navigate(['/setup/customization']);
  }
}
