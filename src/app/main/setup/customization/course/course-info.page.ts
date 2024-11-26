import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { ListCodeInfo, SortedFieldInfo } from 'src/app/models';
import { SubjectInfo } from 'src/app/models/subject.info';
import { ApiService, ApiUrl } from 'src/app/services';
import { FormField } from 'src/app/util/utility-funtions';
import { createBreadcrumb, FormPage } from '../../../page';

@Component({
  templateUrl: './course-info.page.html',
  styleUrls: ['./course-info.page.scss'],
})
export class CourseInfoPage extends FormPage<SubjectInfo> implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private apiService: ApiService
  ) {
    super();
    this.getId(this.route);
    const subTitle = this.id > 0 ? 'Edit Course/Module' : 'New Course/Module';

    this.subTitles = [
      createBreadcrumb('Customization', '/setup/customization'),
      createBreadcrumb('Courses/Modules', '/setup/customization/courses'),
      createBreadcrumb(subTitle, undefined, true),
    ];
    this.rightLinkUrl = ApiUrl.subject_info_right_links;
  }

  ngOnInit(): void {
    this.apiService
      .get<SubjectInfo>(ApiUrl.subject_info + this.id)
      .toPromise()
      .then((data) => (this.info = data));
    this.recordSections = this.apiService
      .get<ListCodeInfo[]>(ApiUrl.subject_record_sections)
      .pipe(
        map((data) => {
          data.forEach((tab) => {
            let isNotEmptyTab = false;
            const tabFields = this.apiService
              .get<SortedFieldInfo<any, string>[]>(
                ApiUrl.subject_fields + this.id + '/' + tab.listCode
              )
              .pipe(
                map((fields) => {
                  let formGroup: FormField<FormControl> = {};
                  fields.forEach((field) => {
                    formGroup[field.fieldName] = new FormControl(
                      field.fieldValue
                    );
                  });
                  this.formGroups.set(
                    tab.listCode,
                    this.formBuilder.group(formGroup)
                  );
                  return fields;
                })
              );

            this.formFields.set(tab.listCode, tabFields);
          });
          return data;
        })
      );
  }
}
