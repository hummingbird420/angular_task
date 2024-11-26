import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { MatListOption } from '@angular/material/list';
import { AlertService, DictionaryService } from 'src/app/services';

@Component({
  selector: 'o-multi-select',
  templateUrl: './multi-select.component.html',
  styleUrls: ['./multi-select.component.scss'],
})
export class MultiSelectComponent implements OnInit {
  @Input() label: string = 'Options';

  @Output() add: EventEmitter<void>;
  @Output() edit: EventEmitter<MatListOption[]>;
  @Output() remove: EventEmitter<MatListOption[]>;

  constructor(
    private alertService: AlertService,
    public dictionaryService: DictionaryService
  ) {
    this.add = new EventEmitter<void>();
    this.edit = new EventEmitter<MatListOption[]>();
    this.remove = new EventEmitter<MatListOption[]>();
  }

  ngOnInit(): void {}

  addOption() {
    this.add.emit();
  }

  editOption(selectedOptions: MatListOption[]) {
    if (this.hasSelectedOptions(selectedOptions)) {
      this.edit.emit(selectedOptions);
    }
  }

  removeOption(selectedOptions: MatListOption[]) {
    if (this.hasSelectedOptions(selectedOptions)) {
      this.remove.emit(selectedOptions);
    }
  }

  hasSelectedOptions(selectedOptions: MatListOption[]): boolean {
    if (selectedOptions.length == 0) {
      this.alertService.showAlert('Please select an option');
      return false;
    }
    return true;
  }
}
