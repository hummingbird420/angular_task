import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { SystemOptionsInfo } from 'src/app/models';
import { ApiService, ApiUrl } from 'src/app/services';
import { FormField } from 'src/app/util/utility-funtions';
import { createBreadcrumb, Page } from '../../page';

@Component({
  templateUrl: './system-options.page.html',
  styleUrls: ['./system-options.page.scss'],
})
export class SystemOptionsPage extends Page implements OnInit, OnDestroy {
  destroy: Subject<void> = new Subject();
  systemOptions: SystemOptionsInfo[] = [];
  formGroup: FormGroup = new FormGroup({});
  search: string = '';

  constructor(
    private apiService: ApiService,
    private formBuilder: FormBuilder,
    private cdRef: ChangeDetectorRef
  ) {
    super();
    //this.subTitles = ['Customization', 'System Options'];
    this.subTitles = [
      createBreadcrumb('Customization', '/setup/customization'),
      createBreadcrumb('System Options', undefined, true),
    ];
    this.apiService
      .get<SystemOptionsInfo[]>(ApiUrl.system_options)
      .pipe(takeUntil(this.destroy))
      .pipe(
        map((data) => {
          let controls: FormField<FormControl> = {};
          data.forEach((optionGroup, i, ar) => {
            optionGroup.options.forEach((option, j, arr) => {
              controls[option.value] = new FormControl(false);
            });
          });
          this.formGroup = this.formBuilder.group(controls);
          return data;
        })
      )
      .subscribe((data) => {
        this.systemOptions = data;
        this.cdRef.detectChanges();
      });
  }

  ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
  }

  ngOnInit(): void {}
}
