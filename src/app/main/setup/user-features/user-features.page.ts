import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { ListCodeInfo, Menu, MenuItem, SortedFieldInfo } from 'src/app/models';
import { ApiService } from 'src/app/services';
import { createBreadcrumb, Page } from '../../page';

interface SubSectionInfo {
  subTitle: string;
  sortedFields: SortedFieldInfo<any, any>[];
}

interface SectionInfo {
  title: string;
  type: string;
  subSections: SubSectionInfo[];
}

interface UserFeatureInfo {
  title: string;
  menus: Menu[];
  sectionInfo: SectionInfo;
}

@Component({
  templateUrl: './user-features.page.html',
  styleUrls: ['./user-features.page.scss'],
})
export class UserFeaturesPage extends Page implements OnInit {
  userFeatures: Observable<UserFeatureInfo[]> = of([]);
  formGroups: FormGroup[] = [];

  constructor(
    private apiService: ApiService,
    private formBuilder: FormBuilder
  ) {
    super();
    this.subTitles = [createBreadcrumb('User Features', undefined, true)];

    this.userFeatures = this.apiService
      .get<UserFeatureInfo[]>('user-features')
      .pipe(
        map((data) => {
          console.log(data);

          data.forEach((userFeature) => {
            const menuGroup: { [key: string]: FormGroup } = {};
            if (userFeature.menus) {
              userFeature.menus.forEach((menu) => {
                if (menu.menuItems) {
                  const controls: { [key: string]: FormControl } = {};
                  menu.menuItems.forEach((menuItem) => {
                    controls[menuItem.itemId] = new FormControl(
                      menuItem.selected
                    );
                  });
                  menuGroup[menu.menuId] = this.formBuilder.group(controls);
                }
              });
            }

            const controls: { [key: string]: FormControl } = {};
            if (userFeature.sectionInfo) {
              userFeature.sectionInfo.subSections.forEach((subSection) => {
                subSection.sortedFields.forEach((field) => {
                  controls[field.fieldName] = new FormControl(field.fieldValue);
                });
              });
            }

            const formGroup: { [key: string]: FormGroup } = {
              menuGroup: this.formBuilder.group(menuGroup),
              permissionGroup: this.formBuilder.group(controls),
            };

            this.formGroups.push(this.formBuilder.group(formGroup));
          });
          console.log(this.formGroups);

          return data;
        })
      );
  }

  ngOnInit(): void {}

  getFormGroup(i: number, menuId: string) {
    return this.formGroups[i].controls.menuGroup.get(menuId) as FormGroup;
  }

  saveOptions() {
    //TODO need
  }
}
