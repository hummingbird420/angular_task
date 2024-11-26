import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'o-edit-del-icon',
  templateUrl: './edit-del-icon.component.html',
  styleUrls: ['./edit-del-icon.component.scss'],
})
export class EditDelIconComponent implements OnInit {
  @Input() hideEditIcon: boolean = false;
  @Input() hideDeleteIcon: boolean = false;

  @Output() edit!: EventEmitter<void>;
  @Output() delete!: EventEmitter<void>;

  constructor() {}

  ngOnInit(): void {}

  onEdit() {
    this.edit!.emit();
  }

  onDelete() {
    this.delete!.emit();
  }
}
