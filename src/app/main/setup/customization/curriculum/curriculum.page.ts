import {
  ChangeDetectorRef,
  Component,
  Inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CurriculumInfo, SortedFieldInfo } from 'src/app/models';
import {
  AlertService,
  ApiService,
  ApiUrl,
  AuthService,
  DictionaryService,
} from 'src/app/services';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ValidatorFn,
} from '@angular/forms';
import { MatDateFormats, MAT_DATE_FORMATS } from '@angular/material/core';
import { createBreadcrumb, Page } from '../../../page';
import { map, take } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { FormField } from 'src/app/util/utility-funtions';
import { DialogService } from 'src/app/services/dialog.service';
import { getCommonValidators, OrbundValidators } from 'src/app/util';

@Component({
  templateUrl: './curriculum.page.html',
  styleUrls: ['./curriculum.page.scss'],
})
export class CurriculumPage extends Page implements OnInit, OnDestroy {
  curriculumInfo: CurriculumInfo = {} as CurriculumInfo;
  curriculumId: number = 0;
  fields$: Observable<SortedFieldInfo<any, number>[]> = of([]);
  formGroup: FormGroup;
  requiredFields: string[] = [];

  constructor(
    private cdRef: ChangeDetectorRef,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private alertService: AlertService,
    private apiService: ApiService,
    private authService: AuthService,
    private dialogService: DialogService,
    private dictionaryService: DictionaryService,
    @Inject(MAT_DATE_FORMATS) private dateFormats: MatDateFormats
  ) {
    super();
    this.route.paramMap.subscribe((param) => {
      const id = param.get('id');
      this.curriculumId = id ? parseInt(id) : 0;
    });
    const subTitle =
      this.curriculumId > 0 ? 'Curriculum Details' : 'New Curriculum';
    this.subTitles = [
      createBreadcrumb('Customization', '/setup/customization'),
      createBreadcrumb('Curriculums', '/setup/customization/curriculums'),
      createBreadcrumb(subTitle, undefined, true),
    ];
    this.setDateFormat(this.dateFormats, this.authService);
    this.formGroup = this.formBuilder.group({});
  }

  ngOnDestroy(): void {
    this.destroyed();
  }

  ngOnInit(): void {
    this.fields$ = this.apiService
      .get<SortedFieldInfo<any, number>[]>(
        ApiUrl.curriculum_fields + this.curriculumId
      )
      .pipe(
        map((fields) => {
          let formControls: FormField<FormControl> = {};
          fields.forEach((field) => {
            formControls[field.fieldName] = new FormControl(
              field.fieldValue,
              this.getValidator(field)
            );
          });
          this.formGroup = this.formBuilder.group(formControls);
          this.cdRef.detectChanges();
          return fields;
        })
      );
  }

  saveCurriculum() {
    const formControls = this.formGroup.controls;
    if (this.formGroup.invalid) {
      this.alertService.showFormInvalidAlert();
      this.formGroup.markAllAsTouched();
    } else {
      let effectiveDate = formControls.effectiveDate.value;
      if (typeof effectiveDate !== 'string') {
        effectiveDate = effectiveDate.format('yyyy-MM-DD');
      }

      this.curriculumInfo = {
        curriculumId: this.curriculumId,
        curriculumName: formControls.curriculumName.value,
        effectiveDate: effectiveDate,
        isExternalInstitute:
          formControls.isExternalInstitute &&
          formControls.isExternalInstitute.value
            ? 1
            : 0,
        copyFromCurriculumId: formControls.copyFromCurriculumId
          ? formControls.copyFromCurriculumId.value
          : -1,
      };

      this.apiService
        .post<any>(ApiUrl.save_curriculum, this.curriculumInfo)
        .pipe(take(1))
        .subscribe((data) => {
          this.alertService.showSuccessAlert('Curriculum saved successfully.');
          this.backToDirectory();
        });
    }
  }

  deleteCurriculum() {
    this.formGroup.controls['authCode'].updateValueAndValidity();
    if (this.formGroup.controls['authCode'].invalid) {
      this.formGroup.controls['authCode'].markAllAsTouched();
      this.alertService.showErrorAlert('Authorization Code is invalid.');
      return;
    }
    this.dialogService.confirmDelete(() => {
      this.apiService
        .get<any>(ApiUrl.delete_curriculum + this.curriculumId)
        .pipe(take(1))
        .subscribe(
          (data) => {
            this.alertService.showSuccessAlert(
              'Curriculum deleted successfully.'
            );
            this.backToDirectory();
          },
          (error) => {
            this.alertService.showErrorAlert(
              'Failed to delete this curriculum.'
            );
          }
        );
    });
  }

  backToDirectory() {
    this.router.navigate(['setup/customization/curriculums']);
  }

  private getValidator(field: SortedFieldInfo<any, any>): ValidatorFn[] {
    const validators = getCommonValidators(field, this.dictionaryService);
    switch (field.fieldName) {
      case 'curriculumName':
      case 'authCode':
        this.requiredFields.push('curriculumName', 'authCode');
        validators.push(
          OrbundValidators.required(field.fieldTitle, this.dictionaryService)
        );
        if (field.fieldName === 'authCode') {
          validators.push(
            OrbundValidators.authCode(field.fieldTitle, this.dictionaryService)
          );
        }
        break;
      case 'effectiveDate':
        this.requiredFields.push('effectiveDate');
        validators.push(
          OrbundValidators.required(field.fieldTitle, this.dictionaryService)
        );
        validators.push(
          OrbundValidators.date(field.fieldTitle, this.dictionaryService)
        );
        break;
      case 'copyFromCurriculumId':
        this.requiredFields.push('copyFromCurriculumId');
        validators.push(
          OrbundValidators.required(field.fieldTitle, this.dictionaryService)
        );
        break;

      default:
    }
    return validators;
  }
}
