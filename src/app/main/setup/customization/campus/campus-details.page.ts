import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { ListCodeInfo, SortedFieldInfo } from 'src/app/models';
import { CampusInfo } from 'src/app/models/campus.info';
import { CampusService } from 'src/app/services/campus.service';
import { FormField } from 'src/app/util/utility-funtions';
import { createBreadcrumb, Page } from '../../../page';

@Component({
  templateUrl: './campus-details.page.html',
  styleUrls: ['./campus-details.page.scss'],
})
export class CampusDetailsPage extends Page implements OnInit {
  campusId: number = 0;
  campusInfo: CampusInfo = {} as CampusInfo;
  campusRecordSections: Observable<ListCodeInfo[]> = of([]);
  campusFormGroup: Map<string, FormGroup>;
  campusFormFields: Map<string, Observable<SortedFieldInfo<any, string>[]>>;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private campusService: CampusService
  ) {
    super();
    this.subTitles = [
      createBreadcrumb('Customization', '/setup/customization'),
      createBreadcrumb('Campuses', '/setup/customization/campuses'),
      createBreadcrumb('Campus Details', undefined, true),
    ];
    this.rightLinkUrl = 'campus/details-right-links';
    this.route.paramMap.subscribe((param) => {
      const id = param.get('id');
      this.campusId = id ? parseInt(id) : 0;
    });
    this.campusFormGroup = new Map<string, FormGroup>();
    this.campusFormFields = new Map<
      string,
      Observable<SortedFieldInfo<any, string>[]>
    >();
  }

  ngOnInit(): void {
    this.campusRecordSections = this.campusService
      .getCampusRecordSections()
      .pipe(
        map((data) => {
          data.forEach((tab) => {
            let isNotEmptyTab = false;
            const tabFields = this.campusService
              .getCampusFields(this.campusId, tab.listCode)
              .pipe(
                map((fields) => {
                  let formGroup: FormField<FormControl> = {};
                  fields.forEach((field) => {
                    formGroup[field.fieldName] = new FormControl(
                      field.fieldValue
                    );
                  });
                  this.campusFormGroup.set(
                    tab.listCode,
                    this.formBuilder.group(formGroup)
                  );
                  return fields;
                })
              );
            this.campusFormFields.set(tab.listCode, tabFields);
          });
          return data;
        })
      );
  }

  getFormFields(
    sectionName: string
  ): Observable<SortedFieldInfo<any, string>[]> {
    return this.campusFormFields.get(sectionName) || of([]);
  }

  getFormGroup(sectionName: string): FormGroup {
    return this.campusFormGroup.get(sectionName) || new FormGroup({});
  }

  saveCampus() {}
  deleteCampus() {}
  backToDirectory() {
    this.router.navigate(['setup/customization/campuses']);
  }
}
