import {
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter,
  ChangeDetectorRef,
} from '@angular/core';
import { PairValue, SortedFieldInfo } from 'src/app/models';

@Component({
  selector: 'o-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss'],
})
export class DropdownComponent implements OnInit {
  @Input() field: SortedFieldInfo<any, any>;
  @Input() allOption!: PairValue<any, string>;
  @Output() change: EventEmitter<any>;

  constructor() {
    this.field = {
      fieldTitle: 'Dropdown',
      fieldValue: '',
    } as SortedFieldInfo<any, any>;
    this.change = new EventEmitter<any>();
  }

  ngOnInit(): void {}

  onChange() {
    if (this.field) this.change.emit(this.field.fieldValue);
  }
}
