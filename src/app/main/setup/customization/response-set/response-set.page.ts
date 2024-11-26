import { TemplatePortal } from '@angular/cdk/portal';
import {
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ValidatorFn,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatListOption } from '@angular/material/list';
import { ActivatedRoute, Router } from '@angular/router';
import { map, takeUntil } from 'rxjs/operators';
import { AddEditDialog } from 'src/app/components/templates/dialogs/add-edit.dialog';
import {
  PairValue,
  ResponseInfo,
  ResponseSetInfo,
  SortedFieldInfo,
} from 'src/app/models';
import {
  AlertService,
  ApiService,
  DictionaryService,
  ResponseSetService,
} from 'src/app/services';
import { DialogService } from 'src/app/services/dialog.service';
import { getCommonValidators, OrbundValidators } from 'src/app/util';
import { FormField } from 'src/app/util/utility-funtions';
import { MessageBoxType } from '../../../components/message-box/message-box.component';
import { createBreadcrumb, Page, SimpleFormPage } from '../../../page';

@Component({
  templateUrl: './response-set.page.html',
  styleUrls: ['./response-set.page.scss'],
})
export class ResponseSetPage
  extends SimpleFormPage
  implements OnInit, OnDestroy
{
  responseSetId: number = 0;
  responses: ResponseInfo[] = [];
  selected = 'option2';
  responseSetInfo: ResponseSetInfo;
  responseSetTypes: PairValue<number, string>[] = [];
  selectedIndex: number = -1;
  responseFields: Map<string, SortedFieldInfo<any, any>> = new Map<
    string,
    SortedFieldInfo<any, any>
  >();

  //Dialog
  @ViewChild('addEditTemplate') addEditTemplate!: TemplateRef<unknown>;
  addEditTemplatePortal!: TemplatePortal<any>;
  addEditFormGroup: FormGroup;

  messageBoxType: MessageBoxType = MessageBoxType.WARNING;
  waringMessage: string = this.dictionaryService.getTranslationOrWord(
    'For evaluation grades, "P" is the only grade counted for credit.'
  );

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private cdRef: ChangeDetectorRef,
    private formBuilder: FormBuilder,
    private viewContainerRef: ViewContainerRef,
    private apiService: ApiService,
    private dictionaryService: DictionaryService,
    private responseSetService: ResponseSetService,
    private alertService: AlertService,
    private dialogService: DialogService,
    public dialog: MatDialog
  ) {
    super();
    this.route.paramMap.subscribe((param) => {
      const id = param.get('id');
      this.responseSetId = id ? parseInt(id) : 0;
      const prefix = this.responseSetId > 0 ? '' : 'New';
      this.subTitles = [
        createBreadcrumb('Customization', '/setup/customization'),
        createBreadcrumb('Response Sets', '/setup/customization/response-sets'),
        createBreadcrumb(prefix + ' Response Set', undefined, true),
      ];
    });
    this.formGroup = this.formBuilder.group({});
    this.responseSetInfo = {
      responseSetId: this.responseSetId,
      responseSetName: '',
      responseSetType: 0,
      responseSetTypeName: '',
    };
    this.addEditFormGroup = this.formBuilder.group({
      responseId: new FormControl(0),
      responseSetId: new FormControl(this.responseSetId),
      responseText: new FormControl('', [
        OrbundValidators.required('Response Text', this.dictionaryService),
        OrbundValidators.maxLength(250, this.dictionaryService),
      ]),
      responseGrade: new FormControl('', [
        OrbundValidators.required('Response Value', this.dictionaryService),
        OrbundValidators.maxLength(250, this.dictionaryService),
      ]),
      seqNum: new FormControl(0),
    });
  }

  ngOnDestroy(): void {
    this.destroyed();
  }

  ngOnInit(): void {
    this.formFields$ = this.apiService
      .get<SortedFieldInfo<any, number>[]>(
        this.createUrl('response-set-fields', this.responseSetId)
      )
      .pipe(
        map((fields) => {
          let formControls: FormField<FormControl> = {};
          fields.forEach((field) => {
            formControls[field.fieldName] = new FormControl(
              field.fieldValue,
              this.getValidators(field)
            );
          });

          this.formGroup = this.formBuilder.group(formControls);

          return fields;
        }),
        takeUntil(this.destroyed$)
      );

    if (this.responseSetId > 0) {
      this.responseSetService.getResponses(this.responseSetId).then((data) => {
        this.responses = data;
        this.cdRef.detectChanges();
      });
    }
    this.apiService
      .get<SortedFieldInfo<any, any>[]>('response-fields')
      .pipe(
        map((fields) => {
          const controls: { [key: string]: FormControl } = {};
          controls['responseId'] = new FormControl(0);
          controls['responseSetId'] = new FormControl(this.responseSetId);
          fields.forEach((field) => {
            controls[field.fieldName] = new FormControl(
              field.fieldValue,
              this.getValidators(field)
            );
            this.responseFields.set(field.fieldName, field);
          });
          this.addEditFormGroup = this.formBuilder.group(controls);
        }),
        takeUntil(this.destroyed$)
      )
      .subscribe((fields) => {
        this.cdRef.detectChanges();
      });
  }
  ngAfterViewInit(): void {
    this.addEditTemplatePortal = new TemplatePortal(
      this.addEditTemplate,
      this.viewContainerRef
    );
  }

  onSelectionChange(index: number) {
    this.selectedIndex = index;
  }

  getFieldTitle(fieldName: string) {
    const field = this.responseFields.get(fieldName);
    return field ? field.fieldTitle : '';
  }

  addItem() {
    const options = AddEditDialog.getOptions(
      this.addEditFormGroup,
      this.addEditTemplatePortal
    );
    const initValues = {
      responseId: 0,
      responseSetId: this.responseSetId,
      responseGrade: '',
      responseText: '',
      seqNum: this.responses.length,
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
        const duplicates = this.responses.filter(
          (value) => value.responseGrade == values.responseGrade
        );
        if (duplicates.length > 0) {
          this.alertService.showErrorAlert('Response Grade should be unique.');
        } else {
          this.responses.push(values);
          this.cdRef.detectChanges();
          dialogRef.componentInstance.onSuccess('Option added successfully.');
          initValues.seqNum = this.responses.length;
          dialogRef.componentInstance.resetAddEditForm(initValues);
        }
      });
  }

  editItems(selectedOptions: MatListOption[]) {
    if (this.hasSelectedOptions(selectedOptions)) {
      const options = AddEditDialog.getOptions(
        this.addEditFormGroup,
        this.addEditTemplatePortal,
        { edit: true }
      );
      const dialogRef = this.dialog.open(AddEditDialog, options);
      dialogRef.afterOpened().subscribe((data) => {
        const values = {
          responseId: selectedOptions[0].value.responseId,
          responseSetId: this.responseSetId,
          responseGrade: selectedOptions[0].value.responseGrade,
          responseText: selectedOptions[0].value.responseText,
          seqNum: selectedOptions[0].value.seqNum,
        };
        dialogRef.componentInstance.resetAddEditForm(values);
      });
      dialogRef.componentInstance.addEditEmitter
        .pipe(takeUntil(this.destroyed$))
        .subscribe(() => {
          if (dialogRef.componentInstance.hasError()) {
            return;
          }
          const values = this.addEditFormGroup.value;
          const duplicates = this.responses.filter(
            (value, index) =>
              value.responseGrade == values.responseGrade &&
              index != this.selectedIndex
          );
          if (duplicates.length > 0) {
            this.alertService.showErrorAlert(
              'Response Grade should be unique.'
            );
          } else {
            this.responses.map((value, index, responses) => {
              if (index == this.selectedIndex) {
                responses[index] = values;
              }
            });
            this.cdRef.detectChanges();
            dialogRef.close();
            this.alertService.showSuccessAlert(
              'Response updated successfully.'
            );
          }
        });
    }
  }

  removeItems(selectedOptions: MatListOption[]) {
    if (this.hasSelectedOptions(selectedOptions)) {
      this.dialogService.confirmDelete(() => {
        this.responses.splice(this.selectedIndex, 1);
        this.cdRef.detectChanges();
        this.alertService.showSuccessAlert('Response removed successfully.');
      });
    }
  }

  saveResponseSet() {
    if (this.formGroup.invalid) {
      this.formGroup.markAllAsTouched();
      return;
    }
    if (this.responses.length == 0) {
      this.alertService.showErrorAlert('Please add at least one response.');
      return;
    }
    const responseSetInfo = this.formGroup.value;
    responseSetInfo.responseSetId = this.responseSetId;

    for (let i = 0; i < this.responses.length; i++) {
      this.responses[i].responseSetId = this.responseSetId;
    }

    this.responseSetService
      .saveResponseSetInfo(responseSetInfo, this.responses)
      .then((data) => this.backToDirectory());
  }

  deleteResponseSet() {
    this.dialogService.confirmDelete(() => {
      this.responseSetService
        .deleteResponseSet(this.responseSetId)
        .then((data) => {
          this.backToDirectory();
        });
    });
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
      this.alertService.showAlert('Please select an option');
      return false;
    }
    return true;
  }
  backToDirectory() {
    this.router.navigate(['setup/customization/response-sets']);
  }
  getValidators(field: SortedFieldInfo<any, any>): ValidatorFn[] {
    const validators = getCommonValidators(field, this.dictionaryService);
    switch (field.fieldName) {
      case 'responseSetName':
        validators.push(
          OrbundValidators.required(field.fieldTitle, this.dictionaryService)
        );
        break;
      case 'responseText':
      case 'responseGrade':
        validators.push(
          OrbundValidators.required(field.fieldTitle, this.dictionaryService)
        );
    }
    return validators;
  }
}
