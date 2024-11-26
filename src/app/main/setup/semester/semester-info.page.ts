import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { SortedFieldInfo } from 'src/app/models';
import { AlertService, ApiService, ApiUrl } from 'src/app/services';
import { DialogService } from 'src/app/services/dialog.service';
import { FormField } from 'src/app/util/utility-funtions';
import { createBreadcrumb, Page } from '../../page';

@Component({
  templateUrl: './semester-info.page.html',
  styleUrls: ['./semester-info.page.scss'],
})
export class SemesterInfoPage extends Page implements OnInit, OnDestroy {
  semesterId: number = 0;
  fields$: Observable<SortedFieldInfo<any, string>[]> = of([]);
  formGroup: FormGroup;

  constructor(
    private cdRef: ChangeDetectorRef,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private dialogService: DialogService,
    private apiService: ApiService,
    private alertService: AlertService
  ) {
    super();
    this.route.paramMap.subscribe((param) => {
      const id = param.get('id');
      this.semesterId = id ? parseInt(id) : 0;
    });
    const subTitle = this.semesterId > 0 ? 'Semester Details' : 'New Semester';
    this.subTitles = [
      createBreadcrumb('Semesters', '/setup/semesters'),
      createBreadcrumb(subTitle, undefined, true),
    ];
    // this.rightLinkUrl = ApiUrl.department_info_right_links;

    this.formGroup = this.formBuilder.group({});
  }
  ngOnDestroy(): void {
    this.destroyed();
  }

  ngOnInit(): void {
    this.fields$ = this.apiService
      .get<SortedFieldInfo<any, any>[]>(
        this.createUrl(ApiUrl.semester_fields, this.semesterId)
      )
      .pipe(
        map((fields) => {
          let controls: FormField<FormControl> = {};
          fields.forEach((field) => {
            controls[field.fieldName] = new FormControl(field.fieldValue);
          });
          this.formGroup = this.formBuilder.group(controls);
          return fields;
        }),
        takeUntil(this.destroyed$)
      );
  }

  saveSemester() {}
  deleteSemester() {}
}
