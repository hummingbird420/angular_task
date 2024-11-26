import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, takeUntil } from 'rxjs/operators';
import { ListCodeInfo, SortedFieldInfo } from 'src/app/models';
import { ApiService } from 'src/app/services';
import { createBreadcrumb, Page } from '../../../page';

@Component({
  templateUrl: './tuition-setup.page.html',
  styleUrls: ['./tuition-setup.page.scss'],
})
export class TuitionSetupPage extends Page implements OnInit {
  recordSections: Observable<ListCodeInfo[]> = of([]);
  semesterDropdown: SortedFieldInfo<number, number>;
  semesterFormControl: FormControl = new FormControl(0);
  selectedSemester: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  constructor(
    private cdRef: ChangeDetectorRef,
    private apiService: ApiService
  ) {
    super();
    this.subTitles = [createBreadcrumb('Tuition Setup', undefined, true)];
    this.rightLinkUrl = 'tuition/tuition-right-link';
    this.recordSections = this.apiService.get(
      'tuition/tuition-record-sections'
    );
    this.semesterDropdown = {} as SortedFieldInfo<number, number>;
    this.apiService
      .get<SortedFieldInfo<number, number>>('semester/dropdown')
      .pipe(delay(0), takeUntil(this.destroyed$))
      .subscribe((data) => {
        this.semesterDropdown = data;
        this.semesterFormControl.setValue(this.semesterDropdown.fieldValue, {
          onlySelf: true,
        });
        this.selectedSemester.next(this.semesterDropdown.fieldValue);
        this.cdRef.detectChanges();
      });
  }

  ngOnInit(): void {}

  onSemesterChange() {
    this.selectedSemester.next(this.semesterFormControl.value);
  }
}
