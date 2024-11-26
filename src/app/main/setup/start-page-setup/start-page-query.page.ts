import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDateFormats, MAT_DATE_FORMATS } from '@angular/material/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { SortedFieldInfo } from 'src/app/models';
import { ApiService, AuthService } from 'src/app/services';
import { FormField } from 'src/app/util/utility-funtions';
import { createBreadcrumb, Page } from '../../page';

@Component({
  templateUrl: './start-page-query.page.html',
  styleUrls: ['./start-page-query.page.scss'],
})
export class StartPageQueryPage extends Page implements OnInit {
  queryId: number = 0;
  fields$: Observable<SortedFieldInfo<any, string>[]> = of([]);
  formGroup: FormGroup;

  constructor(
    private cdRef: ChangeDetectorRef,
    private apiService: ApiService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    @Inject(MAT_DATE_FORMATS) private dateFormats: MatDateFormats
  ) {
    super();
    this.route.paramMap.subscribe((param) => {
      const id = param.get('id');
      this.queryId = id ? parseInt(id) : 0;
    });
    const subTitlePrefix = this.queryId > 0 ? '' : 'New ';
    this.subTitles = [
      createBreadcrumb('Start Page Setup', '/setup/start-page-setup'),
      createBreadcrumb(subTitlePrefix + 'Start Page Query', undefined, true),
    ];
    this.formGroup = this.formBuilder.group({});
  }

  ngOnInit(): void {
    this.fields$ = this.apiService
      .get<SortedFieldInfo<any, any>[]>(
        this.createUrl('start-page-fields', this.queryId)
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

  saveQuery() {
    const allValue = this.formGroup.value;
    console.log(allValue);
  }
  deleteQuery() {
    const allValue = this.formGroup.value;
    console.log(allValue);
  }
  backToDirectory() {}
}
