import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { ListCodeInfo, SortedFieldInfo } from 'src/app/models';
import {
  AlertService,
  ApiService,
  ApiUrl,
  AuthService,
  DictionaryService,
} from 'src/app/services';
import { FormField } from 'src/app/util/utility-funtions';
import { createBreadcrumb, Page } from '../../page';

@Component({
  templateUrl: './account-profile.page.html',
  styleUrls: ['./account-profile.page.scss'],
})
export class AccountProfilePage extends Page implements OnInit {
  recordSections: Observable<ListCodeInfo[]> = of([]);
  formGroups: Map<string, FormGroup>;
  formFields: Map<string, Observable<SortedFieldInfo<any, string>[]>>;
  saveButtonLabel: string =
    this.dictionaryService.getTranslationOrWord('Update');

  constructor(
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private dictionaryService: DictionaryService,
    private alertService: AlertService,
    private authService: AuthService
  ) {
    super();
    this.subTitles = [createBreadcrumb('Account & Profile', undefined, true)];
    this.formGroups = new Map<string, FormGroup>();
    this.formFields = new Map<
      string,
      Observable<SortedFieldInfo<any, string>[]>
    >();
    this.recordSections = this.apiService
      .get<ListCodeInfo[]>(ApiUrl.account_profile_record_section)
      .pipe(
        map((tabs) => {
          tabs.forEach((tab) => {
            const tabFields = this.apiService
              .get<SortedFieldInfo<any, string>[]>(
                this.createUrl(ApiUrl.account_profile_fields, tab.listCode)
              )
              .pipe(
                map((fields) => {
                  let formGroup: FormField<FormControl> = {};
                  fields.forEach((field) => {
                    const formControl = new FormControl(field.fieldValue);
                    if (field.fieldType === 'READ_ONLY') {
                      formControl.disable({ onlySelf: true });
                    }

                    formGroup[field.fieldName] = formControl;
                  });

                  this.formGroups.set(
                    tab.listCode,
                    this.formBuilder.group(formGroup)
                  );
                  return fields;
                }),
                takeUntil(this.destroyed$)
              );
            this.formFields.set(tab.listCode, tabFields);
          });

          return tabs;
        }),
        takeUntil(this.destroyed$)
      );
  }

  ngOnInit(): void {}

  saveAccountProfile() {
    let values = {};
    this.formGroups.forEach((formGroup, key, map) => {
      values = { ...values, ...formGroup.value };
    });
    console.log(values);
    this.apiService
      .postPromise('save-admin-account-profile', values)
      .then((data) => {
        this.authService.checkAuthentication();
        this.alertService.showSuccessAlert('Data saved successfully.');
      });
  }

  getFormFields(
    sectionName: string
  ): Observable<SortedFieldInfo<any, string>[]> {
    return this.formFields.get(sectionName) || of([]);
  }

  getFormGroup(sectionName: string): FormGroup {
    const formGroup = this.formGroups.get(sectionName) || new FormGroup({});
    return formGroup;
  }
}
