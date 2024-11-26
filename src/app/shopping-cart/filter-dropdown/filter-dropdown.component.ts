import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { PairValue, SortedFieldInfo } from 'src/app/models';

@Component({
  selector: 'cart-filter-dropdown',
  templateUrl: './filter-dropdown.component.html',
  styleUrls: ['./filter-dropdown.component.scss'],
})
export class FilterDropdownComponent implements OnInit {
  @Input() field: SortedFieldInfo<any, any>;
  @Input() allOption!: PairValue<any, string>;
  @Input() clearSelection!: EventEmitter<void>;
  @Input() value!: EventEmitter<any>;
  @Output() change: EventEmitter<any>;
  formControl: FormControl;
  constructor() {
    this.change = new EventEmitter<any>();
    this.field = {
      fieldTitle: 'Dropdown',
      fieldValue: '',
    } as SortedFieldInfo<any, any>;
    this.allOption = { value: undefined, title: 'All' } as PairValue<any, string>;

    this.formControl = new FormControl(this.field.fieldValue);
  }

  ngOnInit(): void {
    const options = { onlySelf: true };

    this.clearSelection.subscribe(() => this.formControl.setValue(undefined, options));
    this.value.subscribe((value) => {
      console.log('dropdown value:' + value);

      this.formControl.setValue(value, options);
    });
    this.formControl.setValue(this.field.fieldValue, options);
  }

  onChange() {
    if (this.field) {
      this.change.emit(this.formControl.value);
    }
  }
}
