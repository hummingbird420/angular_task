import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Menu } from 'src/app/models';

@Component({
  selector: 'o-menu-checkboxes',
  templateUrl: './menu-checkboxes.component.html',
  styleUrls: ['./menu-checkboxes.component.scss'],
})
export class MenuCheckboxesComponent implements OnInit, OnDestroy {
  destroy$ = new Subject();
  @Input() menu!: Menu;
  @Input() formGroup: FormGroup = new FormGroup({});
  allChecked: boolean = false;

  constructor() {}
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnInit(): void {
    this.allChecked = this.isAllChecked();
    this.formGroup.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        const value = this.formGroup.value;
        this.allChecked = this.isAllChecked(value);
      });
  }

  isAllChecked(value?: { [key: string]: boolean }) {
    if (this.menu.menuItems == null) {
      return false;
    }
    return value
      ? this.menu.menuItems.every((m) => value[m.itemId])
      : this.menu.menuItems.every((m) => m.selected);
  }

  isIndeterminate() {
    if (this.menu.menuItems == null) {
      return false;
    }
    const value = this.formGroup.value;
    return (
      this.menu.menuItems.filter((m) => value[m.itemId]).length > 0 &&
      !this.allChecked
    );
  }

  checkAll(checked: boolean) {
    if (this.menu.menuItems == null) {
      return;
    }
    const values: { [key: string]: boolean } = {};
    this.menu.menuItems.forEach((m) => (values[m.itemId] = checked));
    this.formGroup.patchValue(values);
  }
}
