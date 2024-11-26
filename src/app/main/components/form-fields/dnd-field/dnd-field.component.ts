import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { SortedFieldInfo } from 'src/app/models';

@Component({
  selector: 'o-dnd-field',
  templateUrl: './dnd-field.component.html',
  styleUrls: ['./dnd-field.component.scss'],
})
export class DndFieldComponent implements OnInit {
  @Input() field: SortedFieldInfo<any, string> = {} as SortedFieldInfo<
    any,
    string
  >;

  @Input() index: number = -1;
  @Input() hideEditIcon: boolean = false;
  @Input() hideRemoveIcon: boolean = false;

  @Output() edit: EventEmitter<number>;
  @Output() remove: EventEmitter<number>;

  constructor() {
    this.edit = new EventEmitter<number>();
    this.remove = new EventEmitter<number>();
  }

  ngOnInit(): void {}

  editField() {
    this.edit.emit(this.index);
  }

  removeField() {
    this.remove.emit(this.index);
  }
}
