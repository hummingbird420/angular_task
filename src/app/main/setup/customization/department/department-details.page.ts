import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { DepartmentInfo, SortedFieldInfo } from 'src/app/models';
import {
  AlertService,
  ApiService,
  ApiUrl,
  DictionaryService,
} from 'src/app/services';
import {
  AbstractControl,
  AsyncValidatorFn,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
} from '@angular/forms';
import { FormField } from 'src/app/util/utility-funtions';
import { createBreadcrumb, Page } from '../../../page';
import { DialogService } from 'src/app/services/dialog.service';
import { map } from 'rxjs/operators';
import { getCommonValidators, OrbundValidators } from 'src/app/util';

export class DepartmentValidator {
  static checkDuplicateCode(
    apiService: ApiService,
    dictionaryService: DictionaryService,
    levelId: number
  ): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      return apiService
        .get<{ isLevelCodeExist: boolean }>(
          'level/check-duplicate-level-code/' + control.value + '/' + levelId
        )
        .pipe(
          map((data) => {
            if (data.isLevelCodeExist) {
              return {
                message:
                  dictionaryService.getTranslationOrWord('The code') +
                  ' <b><i>' +
                  control.value +
                  '</i></b>' +
                  ' ' +
                  dictionaryService.getTranslationOrWord(
                    'already exists, please try another one.'
                  ),
              };
            }
            return null;
          })
        );
    };
  }
}

@Component({
  templateUrl: './department-details.page.html',
  styleUrls: ['./department-details.page.scss'],
})
export class DepartmentDetailsPage extends Page implements OnInit {
  levelId: number = 0;
  departmentInfo: DepartmentInfo = {} as DepartmentInfo;
  departmentFields$: Observable<SortedFieldInfo<any, string>[]> = of([]);
  formGroup: FormGroup;
  requiredFields: string[] = [];

  constructor(
    private cdRef: ChangeDetectorRef,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private dialogService: DialogService,
    private apiService: ApiService,
    private alertService: AlertService,
    private dictionaryService: DictionaryService
  ) {
    super();
    this.route.paramMap.subscribe((param) => {
      const id = param.get('id');
      this.levelId = id ? parseInt(id) : 0;
    });
    const subTitle = this.levelId > 0 ? 'Department Details' : 'New Department';
    this.subTitles = [
      createBreadcrumb('Customization', '/setup/customization'),
      createBreadcrumb('Departments', '/setup/customization/departments'),
      createBreadcrumb(subTitle, undefined, true),
    ];
    this.rightLinkUrl = ApiUrl.department_info_right_links;

    this.formGroup = this.formBuilder.group({});
  }

  initForm() {
    let formGroupElements: FormField<FormControl> = {};
    this.apiService
      .getPromise<SortedFieldInfo<any, any>[]>(
        ApiUrl.department_fields + this.levelId
      )
      .then((fields) => {
        fields.forEach((field) => {
          let validators = this.getValidator(field);
          let asyncValidators = null;

          if (field.fieldName === 'levelCode') {
            asyncValidators = DepartmentValidator.checkDuplicateCode(
              this.apiService,
              this.dictionaryService,
              this.levelId
            );
          }

          formGroupElements[field.fieldName] = new FormControl(
            field.fieldValue,
            validators,
            asyncValidators
          );
        });
        this.formGroup = this.formBuilder.group(formGroupElements);
        this.departmentFields$ = of(fields);
        this.cdRef.detectChanges();
      });
  }

  ngOnInit(): void {
    this.initForm();
  }

  saveDepartment() {
    const controls = this.formGroup.controls;
    if (this.formGroup.invalid) {
      this.alertService.showFormInvalidAlert();
      this.formGroup.markAllAsTouched();
    } else {
      this.departmentInfo.levelName = controls.levelName.value;
      this.departmentInfo.levelCode = controls.levelCode.value;
      this.departmentInfo.departmentHead = controls.departmentHead.value;
      this.departmentInfo.departmentHeadEmail =
        controls.departmentHeadEmail.value;
      this.departmentInfo.departmentHeadPhone =
        controls.departmentHeadPhone.value;
      this.departmentInfo.assistant = controls.assistant.value;
      this.departmentInfo.seqNum = controls.seqNum.value;
      this.departmentInfo.levelId = this.levelId;
      console.log(controls.seqNum.value);

      this.apiService
        .postPromise(ApiUrl.save_department, this.departmentInfo)
        .then((data) => this.backToDirectory());
    }
  }

  deleteDepartment() {
    this.dialogService.confirmDelete(() => {
      this.apiService
        .postPromise(ApiUrl.delete_department + this.levelId, null)
        .then((data) => this.backToDirectory());
    });
  }

  backToDirectory() {
    this.router.navigate(['setup/customization/departments']);
  }

  private getValidator(field: SortedFieldInfo<any, any>) {
    const validators = getCommonValidators(field, this.dictionaryService);
    switch (field.fieldName) {
      case 'levelName':
      case 'levelCode':
        this.requiredFields.push('levelName', 'levelCode');
        validators.push(
          OrbundValidators.required(field.fieldTitle, this.dictionaryService)
        );
        break;
      case 'seqNum':
        this.requiredFields.push('seqNum');
        validators.push(
          OrbundValidators.required(field.fieldTitle, this.dictionaryService)
        );
        validators.push(OrbundValidators.minValue(0, this.dictionaryService));
        break;
      case 'departmentHeadEmail':
        validators.push(
          OrbundValidators.email(field.fieldTitle, this.dictionaryService)
        );
        break;
      default:
    }
    return validators;
  }
}
