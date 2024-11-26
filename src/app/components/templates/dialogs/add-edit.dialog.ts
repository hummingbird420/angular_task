import { ComponentPortal, Portal } from '@angular/cdk/portal';
import {
  Component,
  OnInit,
  EventEmitter,
  Inject,
  OnDestroy,
  Injector,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialogConfig, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { mergeMap, takeUntil } from 'rxjs/operators';
import { AlertService, DictionaryService } from 'src/app/services';
import { SucessComponent } from '../status/sucess/sucess.component';

export interface AddEditDialogInfo {
  formGroup: FormGroup;
  title?: string;
  portal?: Portal<any>;
  edit?: boolean;
}

@Component({
  selector: 'o-add-edit',
  templateUrl: './add-edit.dialog.html',
  styleUrls: ['./add-edit.dialog.scss'],
})
export class AddEditDialog implements OnInit, OnDestroy {
  destroyed = new Subject<void>();
  private _addEditEmitter: EventEmitter<void> = new EventEmitter<void>();
  title: string = 'Add Edit Dialog';
  addButtonLabel: string = 'Add';
  closeButtonLabel = 'Close';
  addIcon: string = 'add';
  addEditFormGroup: FormGroup;
  success: boolean = false;
  portal?: Portal<any>;

  constructor(
    private alertService: AlertService,
    @Inject(MAT_DIALOG_DATA) public dialogInfo: AddEditDialogInfo
  ) {
    this.addEditFormGroup = dialogInfo.formGroup;

    if (this.dialogInfo.title) {
      this.title = this.dialogInfo.title;
    }
    if (this.dialogInfo.edit) {
      this.addButtonLabel = 'Update';
      this.addIcon = 'update';
    }
  }

  ngOnInit(): void {}
  ngOnDestroy(): void {
    this.destroyed.next();
    this.destroyed.complete();
  }

  get addEditEmitter(): EventEmitter<void> {
    return this._addEditEmitter;
  }

  emitAddEditEvent() {
    if (this.success) {
      this.addButtonLabel = 'Add';
      this.dialogInfo.portal = this.portal;
      this.success = false;
    } else {
      this._addEditEmitter.emit();
    }
  }

  onClose() {
    this.addEditFormGroup.markAsUntouched();
  }

  onSuccess(message?: string) {
    this.success = true;
    this.addButtonLabel = 'Add More';
    this.addIcon = 'add';
    this.portal = this.dialogInfo.portal;
    if (!message) {
      message = 'Successful';
    }
    const injector = Injector.create({
      providers: [{ provide: 'SUCCESS_MSG', useValue: message }],
    });
    this.dialogInfo.portal = new ComponentPortal(
      SucessComponent,
      undefined,
      injector
    );
    this.resetAddEditForm();
  }

  static getOptions(
    formGroup: FormGroup,
    portal: Portal<any>,
    options?: {
      width?: string;
      edit?: boolean;
      title?: string;
    }
  ): MatDialogConfig<any> {
    return {
      width: options?.width ? options.width : '250px',
      disableClose: true,
      closeOnNavigation: true,
      autoFocus: false,
      data: {
        formGroup: formGroup,
        title: options?.title
          ? options?.title
          : (options?.edit ? 'Edit ' : 'Add ') + 'Option',
        portal: portal,
        edit: options?.edit,
      },
    };
  }

  resetAddEditForm(values?: any) {
    this.addEditFormGroup.markAsPristine();
    this.addEditFormGroup.markAsUntouched();
    this.addEditFormGroup.updateValueAndValidity();
    this.addEditFormGroup.reset(values);
  }
  hasError() {
    this.addEditFormGroup.markAllAsTouched();
    if (this.addEditFormGroup.invalid) {
      this.alertService.showErrorAlert('Please fill in the required fields.');
      return true;
    }
    return false;
  }
}
