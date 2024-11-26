import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'o-record-template-action-bar',
  templateUrl: './record-template-action-bar.component.html',
  styleUrls: ['./record-template-action-bar.component.scss'],
})
export class RecordTemplateActionBarComponent implements OnInit {
  @Output() done: EventEmitter<void>;
  @Output() addTab: EventEmitter<void>;
  @Output() addStandardField: EventEmitter<void>;
  @Output() addCustomField: EventEmitter<void>;

  constructor() {
    this.done = new EventEmitter<void>();
    this.addTab = new EventEmitter<void>();
    this.addStandardField = new EventEmitter<void>();
    this.addCustomField = new EventEmitter<void>();
  }

  ngOnInit(): void {}
}
