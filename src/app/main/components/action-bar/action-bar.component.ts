import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  Input,
  ChangeDetectorRef,
} from '@angular/core';
import { DictionaryService } from 'src/app/services';

@Component({
  selector: 'o-action-bar',
  templateUrl: './action-bar.component.html',
  styleUrls: ['./action-bar.component.scss'],
})
export class ActionBarComponent implements OnInit {
  @Input() type: 'add' | 'edit' = 'add';
  @Input() fullWidth: boolean = false;

  @Output() save: EventEmitter<void>;
  @Output() cancel: EventEmitter<void>;
  @Output() delete: EventEmitter<void>;
  @Output() back: EventEmitter<void>;

  saveButtonLabel: string = 'Save';
  deleteButtonLabel: string = 'Delete';
  cancelButtonLabel: string = 'Cancel';
  backButtonLabel: string = 'Back';

  saveIcon: string = 'save';
  fxFlex: number = 75;

  constructor(private cdRef: ChangeDetectorRef) {
    this.save = new EventEmitter();
    this.cancel = new EventEmitter();
    this.delete = new EventEmitter();
    this.back = this.cancel;
  }

  ngOnInit(): void {
    if (this.type === 'edit') {
      this.saveButtonLabel = 'Update';
      this.saveIcon = 'update';
    } else if (this.fullWidth) {
      this.fxFlex = 100;
    }

    this.cdRef.detectChanges();
  }

  onSave(): void {
    this.save.emit();
  }

  onCancel(): void {
    this.cancel.emit();
  }

  onDelete(): void {
    this.delete.emit();
  }
}
