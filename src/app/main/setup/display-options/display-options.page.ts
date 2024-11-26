import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map, take, takeUntil } from 'rxjs/operators';
import { CheckboxInfo } from 'src/app/models/checkbox.info';
import { AlertService, ApiService } from 'src/app/services';
import { createBreadcrumb, Page } from '../../page';

interface DisplayOptionSectionInfo {
  name: string;
  fields: CheckboxInfo[];
}
interface DisplayOptionInfo {
  name: string;
  displayOptionSections: DisplayOptionSectionInfo[];
}

@Component({
  templateUrl: './display-options.page.html',
  styleUrls: ['./display-options.page.scss'],
})
export class DisplayOptionsPage extends Page implements OnInit {
  displayOptions: Observable<DisplayOptionInfo[]> = of([]);
  formGroup: FormGroup;
  constructor(
    private apiService: ApiService,
    private formBuilder: FormBuilder,
    private alertService: AlertService
  ) {
    super();
    this.subTitles = [createBreadcrumb('Display Options', undefined, true)];
    this.formGroup = this.formBuilder.group({});
    this.displayOptions = this.apiService
      .get<DisplayOptionInfo[]>('display-options')
      .pipe(
        map((options) => {
          const controls: { [key: string]: FormControl } = {};
          options.forEach((option) => {
            if (option.displayOptionSections) {
              option.displayOptionSections.forEach((section) => {
                if (section.fields) {
                  section.fields.forEach((field) => {
                    controls[field.name] = new FormControl(field.checked);
                  });
                }
              });
            }
          });
          this.formGroup = this.formBuilder.group(controls);
          return options;
        }),
        takeUntil(this.destroyed$)
      );
  }

  ngOnInit(): void {}

  saveOptions() {
    const value = this.formGroup.value;
    console.log(value);
    this.apiService
      .post('save-display-options', value)
      .pipe(take(1))
      .subscribe((data) => {
        this.alertService.showSuccessAlert(
          'Display options are saved successfully.'
        );
      });
  }
}
