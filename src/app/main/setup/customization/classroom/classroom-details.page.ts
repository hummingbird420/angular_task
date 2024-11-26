import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { ClassroomInfo, SortedFieldInfo } from 'src/app/models';
import { AlertService, ApiService, DictionaryService } from 'src/app/services';
import { DialogService } from 'src/app/services/dialog.service';
import { getCommonValidators, OrbundValidators } from 'src/app/util';
import { FormField } from 'src/app/util/utility-funtions';
import { createBreadcrumb, Page } from '../../../page';

@Component({
  templateUrl: './classroom-details.page.html',
  styleUrls: ['./classroom-details.page.scss'],
})
export class ClassroomDetailsPage extends Page implements OnInit {
  classroomId: number = 0;
  fields$: Observable<SortedFieldInfo<any, string>[]> = of([]);
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
      this.classroomId = id ? parseInt(id) : 0;
    });
    const subTitle =
      this.classroomId > 0 ? 'Classroom Details' : 'New Classroom';
    this.subTitles = [
      createBreadcrumb('Customization', '/setup/customization'),
      createBreadcrumb('Classrooms', '/setup/customization/classrooms'),
      createBreadcrumb(subTitle, undefined, true),
    ];
    this.rightLinkUrl = '';

    this.formGroup = this.formBuilder.group({});
  }

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    let formGroupElements: FormField<FormControl> = {};
    this.apiService
      .get<SortedFieldInfo<any, any>[]>(
        this.createUrl('classroom/fields', this.classroomId)
      )
      .pipe(takeUntil(this.destroyed$))
      .subscribe((fields) => {
        fields.forEach((field) => {
          let validators = this.getValidator(field);
          formGroupElements[field.fieldName] = new FormControl(
            field.fieldValue,
            validators
          );
        });
        this.formGroup = this.formBuilder.group(formGroupElements);
        this.fields$ = of(fields);
        this.cdRef.detectChanges();
      });
  }

  saveClassroom() {
    this.formGroup.updateValueAndValidity();
    if (this.formGroup.invalid) {
      this.alertService.showFormInvalidAlert();
      this.formGroup.markAllAsTouched();
    } else {
      const controls = this.formGroup.controls;
      const classroomInfo = {} as ClassroomInfo;
      classroomInfo.buildingName = controls.buildingName.value;
      classroomInfo.campusCode = controls.campusCode.value;
      classroomInfo.capacity = controls.capacity.value;
      classroomInfo.classroomId = this.classroomId;
      classroomInfo.facilities = controls.facilities.value;
      classroomInfo.roomNumber = controls.roomNumber.value;
      this.apiService
        .post('classroom/save', classroomInfo)
        .pipe(take(1))
        .subscribe((data) => this.backToDirectory());
    }
  }
  deleteClassroom() {
    this.dialogService.confirmDelete(() => {
      this.apiService
        .put(this.createUrl('classroom/delete', this.classroomId), '')
        .pipe(take(1))
        .subscribe((data) => {
          this.backToDirectory();
        });
    });
  }

  backToDirectory() {
    this.router.navigate(['setup/customization/classrooms']);
  }

  private getValidator(field: SortedFieldInfo<any, any>) {
    const validators = getCommonValidators(field, this.dictionaryService);
    switch (field.fieldName) {
      case 'roomNumber':
        this.requiredFields.push('roomNumber');
        validators.push(
          OrbundValidators.required(field.fieldTitle, this.dictionaryService)
        );
        break;
      case 'capacity':
        this.requiredFields.push('capacity');
        validators.push(
          OrbundValidators.required(field.fieldTitle, this.dictionaryService),
          OrbundValidators.minValue(0, this.dictionaryService),
          OrbundValidators.maxValue(10000, this.dictionaryService)
        );
        break;
      default:
    }
    return validators;
  }
}
