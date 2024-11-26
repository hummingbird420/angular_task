import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { map, takeUntil } from 'rxjs/operators';
import { ProgramInfo, SortedFieldInfo } from 'src/app/models';
import { ApiService, ApiUrl } from 'src/app/services';
import { FormField } from 'src/app/util/utility-funtions';
import { createBreadcrumb, FormPage, Page } from '../../../page';

@Component({
  templateUrl: './program-info.page.html',
  styleUrls: ['./program-info.page.scss'],
})
export class ProgramInfoPage extends FormPage<ProgramInfo> implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private apiService: ApiService
  ) {
    super();
    this.getId(this.route);
    const subTitle = (this.id > 0 ? 'Edit' : 'New') + ' Program';
    this.subTitles = [
      createBreadcrumb('Customization', '/setup/customization'),
      createBreadcrumb('Programs', '/setup/customization/programs'),
      createBreadcrumb(subTitle, undefined, true),
    ];
    this.rightLinkUrl = ApiUrl.program_info_right_links;
  }

  ngOnInit(): void {
    const tabFields = this.apiService
      .get<SortedFieldInfo<any, string>[]>(
        this.createUrl(ApiUrl.program_fields, this.id)
      )
      .pipe(
        map((fields) => {
          let formGroup: FormField<FormControl> = {};
          fields.forEach((field) => {
            formGroup[field.fieldName] = new FormControl(field.fieldValue);
          });
          this.formGroups.set('notab', this.formBuilder.group(formGroup));
          return fields;
        }),
        takeUntil(this.destroyed$)
      );
    this.formFields.set('notab', tabFields);
  }
}
